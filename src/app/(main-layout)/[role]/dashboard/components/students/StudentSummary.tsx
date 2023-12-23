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
import { TotalMaleFemaleStudentsType } from "@/queries/dashboard";

type StudentSummaryProps = {
  data: TotalMaleFemaleStudentsType[];
  name: string;
  year: string;
  fullTotal: number;
};

const StudentSummary = ({
  data,
  name,
  year,
  fullTotal,
}: StudentSummaryProps) => {
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
          <TableCell className="text-right">{fullTotal}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
export default StudentSummary;
