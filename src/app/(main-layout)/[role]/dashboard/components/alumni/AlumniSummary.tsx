import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardAlumniTotalType } from "@/queries/dashboard";

type AlumniSummaryProps = {
  data: DashboardAlumniTotalType[];
};

const AlumniSummary = ({ data }: AlumniSummaryProps) => {
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
