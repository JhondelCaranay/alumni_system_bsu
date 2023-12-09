import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data = [
  {
    id: 1,
    year: "First Year",
    male: 99,
    female: 99,
    total: 999,
  },
  {
    id: 2,
    year: "Second Year",
    male: 120,
    female: 110,
    total: 1150,
  },
  {
    id: 3,
    year: "Third Year",
    male: 140,
    female: 130,
    total: 1450,
  },
  {
    id: 4,
    year: "Fourth Year",
    male: 160,
    female: 150,
    total: 1750,
  },
];

const StudentSummary = ({ name, year }: { name: string; year: string }) => {
  return (
    <Table>
      <TableCaption>A list of student of year {year}.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">{name}</TableHead>
          <TableHead>MALE</TableHead>
          <TableHead>FEMALE</TableHead>
          <TableHead className="text-right">TOTAL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.year}</TableCell>
            <TableCell>{invoice.male}</TableCell>
            <TableCell>{invoice.female}</TableCell>
            <TableCell className="text-right">{invoice.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow className="dark:text-white">
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
export default StudentSummary;
