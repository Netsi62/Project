import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBySemester'
})
export class FilterBySemesterPipe implements PipeTransform {
  transform(value: any[], semester: string): any[] {
    return value.filter((student) => {
      return this.getSemesterName(student.courseId) === semester;
    });
  }

  // Implement getSemesterName logic here (assuming it's similar to the one in your component)
  private getSemesterName(courseId: string): string {
    // Your logic to get semester name based on courseId
    return '';
  }
}
