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
    year: 2023,
    graduates: 4000,
  },
  {
    id: 2,
    year: 2022,
    graduates: 3000,
  },
  {
    id: 3,
    year: 2021,
    graduates: 2000,
  },
  {
    id: 4,
    year: 2020,
    graduates: 2780,
  },
  {
    id: 5,
    year: 2019,
    graduates: 1890,
  },
  {
    id: 6,
    year: 2018,
    graduates: 2390,
  },
  {
    id: 7,
    year: 2017,
    graduates: 3490,
  },
  {
    id: 8,
    year: 2016,
    graduates: 4000,
  },
  {
    id: 9,
    year: 2015,
    graduates: 3000,
  },
];

const AlumniSummary = () => {
  return (
    <Table>
      <TableCaption>A list of graduates per year</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Year</TableHead>
          <TableHead>Graduates</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.year}</TableCell>
            <TableCell className="text-left">{invoice.graduates}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default AlumniSummary;
