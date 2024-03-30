export interface Grade {
    id: string,
    email: string,
    quiz :number,
    Assignment: number,
    Exam: number,
    editMode : boolean,
    department?: string; 
    courseId: string; 
    courseName : string;
    semesterName: string;
}