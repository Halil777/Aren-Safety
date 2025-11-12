export class CreateTrainingDto {
  title: string;
  description: string;
  type: string;
  status: string;
  instructor: string;
  department?: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: number;
  capacity: number;
  enrolled: number;
  attendees: any[];
  materials: string[];
  certificate: boolean;
  mandatory: boolean;
  completionRate: number;
}
