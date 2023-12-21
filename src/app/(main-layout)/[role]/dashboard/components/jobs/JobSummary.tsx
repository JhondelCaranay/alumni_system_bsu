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
import { DashboardJobsPerYearType } from "@/queries/dashboard";

type JobSummaryProps = {
  data: DashboardJobsPerYearType[];
};

const JobSummary = ({ data }: JobSummaryProps) => {
  return (
    <Table>
      <TableCaption>
        A list of students and alumni with a job per year
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Year</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Alumni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.year}</TableCell>
            <TableCell className="text-left">
              {invoice.studentsWithJob}
            </TableCell>
            <TableCell className="text-left">{invoice.alumniWithJob}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default JobSummary;
