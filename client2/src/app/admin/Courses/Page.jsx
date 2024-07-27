import CourseCollection from "../../../component/admin/courses/CourseCollection";

function Courses({courseList,setNotify,isNotify}) {
  return <div>   
    <CourseCollection courseList={courseList} isNotify={isNotify} setNotify={setNotify} />
     </div>;
}

export default Courses;
