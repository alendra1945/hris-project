import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type DatePickerProps = {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  disabledFn?: (date: Date) => boolean;
};

export function DatePicker({ selected, onSelect, placeholder = 'Pick a date', disabledFn }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          data-empty={!selected}
          className='data-[empty=true]:text-muted-foreground justify-start text-start font-normal w-full'
        >
          {selected ? format(selected, 'MMM d, yyyy') : <span>{placeholder}</span>}
          <CalendarIcon className='ms-auto h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-w- p-0'>
        <Calendar
          mode='single'
          captionLayout='dropdown'
          selected={selected}
          onSelect={onSelect}
          disabled={disabledFn || ((date: Date) => date > new Date() || date < new Date('1900-01-01'))}
        />
      </PopoverContent>
    </Popover>
  );
}
