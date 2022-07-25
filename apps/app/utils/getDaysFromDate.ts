interface IProps {
  date?: string;
  days: number;
}

export default function getDaysFromDate({ date = '', days }: IProps) {
  const newDate = date ? new Date(date) : new Date();
  newDate.setDate(newDate.getDate() - days);

  return newDate;
}
