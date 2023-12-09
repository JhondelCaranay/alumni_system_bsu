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
    studentsWithJobs: 4000,
    AlumniWithJobs: 4000,
  },
  {
    id: 2,
    year: 2022,
    studentsWithJobs: 3000,
    AlumniWithJobs: 3000,
  },
  {
    id: 3,
    year: 2021,
    studentsWithJobs: 2000,
    AlumniWithJobs: 2000,
  },
  {
    id: 4,
    year: 2020,
    studentsWithJobs: 2780,
    AlumniWithJobs: 2780,
  },
  {
    id: 5,
    year: 2019,
    studentsWithJobs: 1890,
    AlumniWithJobs: 1890,
  },
  {
    id: 6,
    year: 2018,
    studentsWithJobs: 2390,
    AlumniWithJobs: 2390,
  },
  {
    id: 7,
    year: 2017,
    studentsWithJobs: 3490,
    AlumniWithJobs: 3490,
  },
  {
    id: 8,
    year: 2016,
    studentsWithJobs: 4000,
    AlumniWithJobs: 4000,
  },
  {
    id: 9,
    year: 2015,
    studentsWithJobs: 3000,
    AlumniWithJobs: 3000,
  },
];

const JobSummary = () => {
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
              {invoice.studentsWithJobs}
            </TableCell>
            <TableCell className="text-left">
              {invoice.AlumniWithJobs}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default JobSummary;
