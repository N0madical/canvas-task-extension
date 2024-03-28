import { Course } from '../../types';
import { LMSConfig } from '../../types/config';
import markGradescopeAssignment from '../gradescope/utils/markAssignment';
import { makeUseAssignments } from '../shared/useAssignments';
import { makeUseCourses } from '../shared/useCourses';
import BrightspaceEntrypoint from './entry';
import loadBrightspaceAssignments from './loaders/assignments';
import loadBrightspaceCourses from './loaders/courses';

export const isBrightspace =
  window.location.hostname === 'opencourses.desire2learn.com';

export const BrightspaceLMSConfig: LMSConfig = {
  isActive: isBrightspace,
  name: 'Demo',
  useAssignments: makeUseAssignments(loadBrightspaceAssignments),
  useCourses: makeUseCourses(loadBrightspaceCourses),
  createAssignment: async () => null, // todo
  markAssignment: markGradescopeAssignment,
  dashCourses: (courses?: Course[]) => {
    const res = new Set<string>();
    if (courses)
      courses.filter((c) => c.position === 1).forEach((c) => res.add(c.id));
    if (res.size === 0) return undefined;
    return res;
  },
  onCoursePage: () => false,
};

export { BrightspaceEntrypoint };
