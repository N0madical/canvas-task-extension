import { useContext, useEffect } from 'react';
import { Course } from '../types';
import { useObjectStore } from './useStore';
import { CourseStoreContext } from '../contexts/contexts';

// call the callback function whenever course colors change
function watchDashboardColors(callback: (id: string, color: string) => void) {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutationRecord) {
      if (
        (mutationRecord.target as HTMLElement).classList.contains(
          'ic-DashboardCard__header_hero'
        )
      ) {
        const parentHeader = (mutationRecord.target as HTMLElement).closest(
          '.ic-DashboardCard__header'
        );
        if (!parentHeader) return;
        // holds the new color
        const coloredHeader = parentHeader.getElementsByClassName(
          'ic-DashboardCard__header_hero'
        ) as HTMLCollectionOf<HTMLElement>;
        // holds the course_id as part of URL
        const courseLink = parentHeader.getElementsByClassName(
          'ic-DashboardCard__link'
        ) as HTMLCollectionOf<HTMLAnchorElement>;
        if (!coloredHeader.length || !courseLink.length) return;
        const color = coloredHeader[0].style.backgroundColor;
        const url = courseLink[0].href.split('/');
        const course_id = url.pop() || url.pop(); // handle trailing slashes in URL
        callback(course_id as string, color);
      }
    });
  });
  // watch all the dashboard cards for changes
  const cards = document.getElementsByClassName('ic-DashboardCard__header');
  Array.from(cards).forEach((card) => {
    observer.observe(card, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: true,
    });
  });

  return observer;
}

export interface CourseStoreInterface {
  state: Record<string, Course>;
  addCourse: (course: Course) => void;
  updateCourseColor: (id: string, color: string) => void;
  getCourseList: (courses?: string[]) => Course[]; // return list of Course objects from subset of course ids (or return all if none specified)
}

export function useNewCourseStore(
  courses: Course[] = []
): CourseStoreInterface {
  const initial: Record<string, Course> = {};
  courses.forEach((course) => (initial[course.id] = course));
  const { state, update } = useObjectStore<Course>(initial);
  function addCourse(course: Course) {
    update([course.id], course);
  }
  function updateCourseColor(id: string, color: string) {
    if (id in state) update([id, 'color'], color);
  }
  function getCourseList(courses?: string[]): Course[] {
    if (!courses) return Object.values(state);
    return courses.map((c) => state[c]);
  }

  useEffect(() => {
    // attach listeners here
    const observers = [watchDashboardColors(updateCourseColor)];
    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return {
    state,
    addCourse,
    updateCourseColor,
    getCourseList,
  };
}

export default function useCourseStore(): CourseStoreInterface {
  return useContext(CourseStoreContext);
}
