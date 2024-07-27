import { useEffect, useState } from "react";
import CourseController from "./components/CourseController";
import CourseState from "./components/CourseState";

export default function Course({ ControlNotification, setNotify, isNotify }) {
  const [collectDetails, setDetails] = useState([]);
  const [mock, setMock] = useState([]);
  const [pageControl, setPageController] = useState({
    mockPage: false,
    courseSettingPage: false,
  });

  return (
    <div>
      <CourseController
        collectDetails={collectDetails}
        isNotify={isNotify}
        setNotify={setNotify}
        ControlNotification={ControlNotification}
        pageControl={pageControl}
        mock={mock}
      />
      <CourseState
        isNotify={isNotify}
        setNotify={setNotify}
        setDetails={setDetails}
        collectDetails={collectDetails}
        setPageController={setPageController}
        setMock={setMock}
      />
    </div>
  );
}
