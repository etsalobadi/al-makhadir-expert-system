import React, { useState, useEffect } from 'react';
import { Search, FileText, Users, Calendar, Gavel } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  type: 'case' | 'expert' | 'announcement' | 'session';
  description: string;
  url: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Mock search data
  const searchData: SearchResult[] = [
    {
      id: 'C001',
      title: 'قسمة تركة المرحوم عبدالله محمد',
      type: 'case',
      description: 'قضية مواريث - قيد التنفيذ',
      url: '/cases'
    },
    {
      id: 'E001',
      title: 'محمد قائد صالح',
      type: 'expert',
      description: 'خبير مواريث - نشط',
      url: '/experts'
    },
    {
      id: 'A001',
      title: 'إعلان جلسة قضية C001',
      type: 'announcement',
      description: 'إعلان قضائي - نشط',
      url: '/announcements'
    },
    {
      id: 'S001',
      title: 'جلسة قضية C001',
      type: 'session',
      description: 'جلسة مجدولة - غداً 10:00 ص',
      url: '/sessions'
    },
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchData.filter(item =>
        item.title.includes(query) ||
        item.description.includes(query) ||
        item.id.includes(query)
      );
      setResults(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'case':
        return <Gavel className="w-4 h-4 text-blue-500" />;
      case 'expert':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'announcement':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'session':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'case':
        return 'قضية';
      case 'expert':
        return 'خبير';
      case 'announcement':
        return 'إعلان';
      case 'session':
        return 'جلسة';
      default:
        return '';
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="البحث في النظام..."
            className="w-full pr-10 bg-gray-50 border-gray-200 focus:bg-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 0 && setIsOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandList>
            {results.length === 0 ? (
              <CommandEmpty>لا توجد نتائج للبحث</CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    {getIcon(result.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.title}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;