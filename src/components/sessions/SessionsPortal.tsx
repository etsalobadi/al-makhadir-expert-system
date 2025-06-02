
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  Video, 
  FileText, 
  Users, 
  ChevronRight,
  Mic,
  MicOff,
  Search,
  Filter,
  Archive,
  Download,
  Play,
  Pause
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { toast } from '@/hooks/use-toast';

interface Session {
  id: string;
  case_id: string;
  session_date: string;
  session_type: string;
  status: string;
  location?: string;
  notes?: string;
  case_number?: string;
  deceased_name?: string;
  transcript?: string;
  audio_recording?: string;
}

const SessionsPortal: React.FC = () => {
  const { user, hasAnyRole } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeToNext, setTimeToNext] = useState<string>('');
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(updateCountdown, 60000);
    updateCountdown();
    return () => clearInterval(interval);
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('case_sessions')
        .select(`
          *,
          inheritance_cases!inner(case_number, deceased_name, assigned_expert)
        `);

      if (hasAnyRole(['expert'])) {
        query = query.eq('inheritance_cases.assigned_expert', user.id);
      }

      const { data, error } = await query
        .order('session_date', { ascending: true });

      if (error) throw error;

      const enrichedSessions = data?.map(session => ({
        ...session,
        case_number: session.inheritance_cases?.case_number,
        deceased_name: session.inheritance_cases?.deceased_name
      })) || [];

      setSessions(enrichedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الجلسات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCountdown = () => {
    const upcomingSessions = sessions
      .filter(s => s.status === 'scheduled' && new Date(s.session_date) > new Date())
      .sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());

    if (upcomingSessions.length > 0) {
      const nextSession = upcomingSessions[0];
      const now = new Date().getTime();
      const sessionTime = new Date(nextSession.session_date).getTime();
      const difference = sessionTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeToNext(`${days}د ${hours}س ${minutes}ق`);
      } else {
        setTimeToNext('الجلسة الآن');
      }
    } else {
      setTimeToNext('لا توجد جلسات قادمة');
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const audioChunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      toast({
        title: "بدء التسجيل",
        description: "تم بدء تسجيل الصوت وتحويله إلى نص"
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "خطأ",
        description: "فشل في بدء التسجيل الصوتي",
        variant: "destructive"
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);
      
      toast({
        title: "توقف التسجيل",
        description: "تم إيقاف التسجيل وحفظ المحضر"
      });
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // Call Supabase Edge Function for transcription
        const { data, error } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio }
        });
        
        if (error) throw error;
        
        if (data?.text) {
          const newText = data.text;
          setTranscript(prev => prev + ' ' + newText);
          
          // Auto-save transcript to active session
          if (activeSession) {
            await updateSessionTranscript(activeSession.id, transcript + ' ' + newText);
          }
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: "خطأ في التفريغ",
        description: "فشل في تحويل الصوت إلى نص",
        variant: "destructive"
      });
    }
  };

  const updateSessionTranscript = async (sessionId: string, newTranscript: string) => {
    try {
      const { error } = await supabase
        .from('case_sessions')
        .update({ notes: newTranscript })
        .eq('id', sessionId);

      if (error) throw error;
      
      // Update local state
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, notes: newTranscript } : s
      ));
    } catch (error) {
      console.error('Error updating transcript:', error);
    }
  };

  const getSessionTypeLabel = (type: string) => {
    const types = {
      hearing: 'جلسة استماع',
      review: 'مراجعة',
      decision: 'إصدار قرار',
      consultation: 'استشارة'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">مجدولة</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">مكتملة</Badge>;
      case 'postponed':
        return <Badge className="bg-yellow-500">مؤجلة</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">ملغية</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.deceased_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || session.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const upcomingSessions = filteredSessions.filter(s => 
    s.status === 'scheduled' && new Date(s.session_date) > new Date()
  );

  const completedSessions = filteredSessions.filter(s => 
    s.status === 'completed'
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-judicial-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Smart Session Header */}
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            نظام الجلسات الذكي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-gray-300 mb-1">الجلسة القادمة</p>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-xl font-bold text-yellow-400">{timeToNext}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-300 mb-1">المحضر النشط</p>
              <div className="flex items-center justify-center gap-2">
                {isRecording ? (
                  <Button 
                    onClick={stopVoiceRecording}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <MicOff className="h-4 w-4 ml-2" />
                    إيقاف التسجيل
                  </Button>
                ) : (
                  <Button 
                    onClick={startVoiceRecording}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Mic className="h-4 w-4 ml-2" />
                    بدء التسجيل
                  </Button>
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-300 mb-1">الأرشيف الذكي</p>
              <Button variant="secondary" className="bg-white text-gray-800 hover:bg-gray-100">
                <Archive className="h-4 w-4 ml-2" />
                عرض الأرشيف
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث برقم القضية أو اسم المتوفى..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
              >
                الكل
              </Button>
              <Button
                variant={filterType === 'scheduled' ? 'default' : 'outline'}
                onClick={() => setFilterType('scheduled')}
              >
                مجدولة
              </Button>
              <Button
                variant={filterType === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilterType('completed')}
              >
                مكتملة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Session Transcript */}
      {(isRecording || transcript) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              محضر الجلسة المباشر
              {isRecording && (
                <Badge className="bg-red-500 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                  جاري التسجيل
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="سيظهر النص المفرغ هنا تلقائياً..."
              className="min-h-32"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline">
                <Download className="h-4 w-4 ml-2" />
                تصدير المحضر
              </Button>
              <Button onClick={() => activeSession && updateSessionTranscript(activeSession.id, transcript)}>
                <FileText className="h-4 w-4 ml-2" />
                حفظ المحضر
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">الجلسات القادمة ({upcomingSessions.length})</TabsTrigger>
          <TabsTrigger value="completed">الجلسات المكتملة ({completedSessions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد جلسات قادمة</p>
              </CardContent>
            </Card>
          ) : (
            upcomingSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          قضية رقم: {session.case_number}
                        </h3>
                        {getStatusBadge(session.status)}
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        المتوفى: {session.deceased_name}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(new Date(session.session_date))}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{new Date(session.session_date).toLocaleTimeString('ar-YE')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{getSessionTypeLabel(session.session_type)}</span>
                        </div>
                      </div>
                      
                      {session.location && (
                        <p className="text-sm text-gray-500 mt-2">
                          المكان: {session.location}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => setActiveSession(session)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Video className="h-4 w-4 ml-1" />
                        انضمام
                      </Button>
                      <Button variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedSessions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد جلسات مكتملة</p>
              </CardContent>
            </Card>
          ) : (
            completedSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">
                          قضية رقم: {session.case_number}
                        </h3>
                        {getStatusBadge(session.status)}
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        المتوفى: {session.deceased_name}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>{formatDate(new Date(session.session_date))}</span>
                        <span>{getSessionTypeLabel(session.session_type)}</span>
                      </div>

                      {session.notes && (
                        <div className="bg-gray-50 p-3 rounded-md mt-2">
                          <p className="text-sm font-medium mb-1">محضر الجلسة:</p>
                          <p className="text-sm text-gray-700">{session.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 ml-1" />
                        عرض المحضر
                      </Button>
                      {session.audio_recording && (
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 ml-1" />
                          تشغيل التسجيل
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionsPortal;
