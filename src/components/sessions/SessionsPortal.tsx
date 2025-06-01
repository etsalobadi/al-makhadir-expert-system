
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Video, FileText, Users, ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

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
}

const SessionsPortal: React.FC = () => {
  const { user, hasAnyRole } = useAuthContext();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeToNext, setTimeToNext] = useState<string>('');

  useEffect(() => {
    fetchSessions();
    
    // Update countdown every minute
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

      // Filter sessions based on user role
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

  const joinSession = (sessionId: string) => {
    // Implement video conferencing integration
    console.log('Joining session:', sessionId);
  };

  const upcomingSessions = sessions.filter(s => 
    s.status === 'scheduled' && new Date(s.session_date) > new Date()
  );

  const completedSessions = sessions.filter(s => 
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
      {/* Header with countdown */}
      <Card className="bg-gradient-to-r from-judicial-primary to-amber-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            بوابة الجلسات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 mb-2">الجلسة القادمة</p>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-xl font-bold">{timeToNext}</span>
              </div>
            </div>
            <Button variant="secondary" className="bg-white text-judicial-primary hover:bg-gray-100">
              <Video className="h-4 w-4 ml-2" />
              الانضمام للجلسة
            </Button>
          </div>
        </CardContent>
      </Card>

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
                      <Button size="sm" onClick={() => joinSession(session.id)}>
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
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(new Date(session.session_date))}</span>
                        <span>{getSessionTypeLabel(session.session_type)}</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 ml-1" />
                      عرض التقرير
                    </Button>
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
