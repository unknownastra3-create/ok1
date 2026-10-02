import { StudentNote, PhotoCard, AuthorizedTeacher, AuthorizedModerator, NoteColor } from '../types';
import chalkboardImg from '../assets/images/classroom_chalkboard_notes_1790936621086.jpg';
import desksImg from '../assets/images/classroom_desks_bright_1790936590562.jpg';
import teacherCheerImg from '../assets/images/teacher_appreciation_cheer_1790955855232.jpg';
import teacherMentoringImg from '../assets/images/teacher_mentoring_students_1790955876144.jpg';

export interface NoteColorTheme {
  bg: string;
  border: string;
  headerText: string;
  bodyText: string;
  authorText: string;
  badgeBg: string;
}

export const HEAD_ADMIN_CONFIG = {
  id: 'master-admin',
  name: 'Principal / Head Administrator',
  email: 'taynanjetraj@gmail.com',
  username: 'taynanjetraj',
  accessCode: '6378292',
  role: 'admin' as const,
  title: 'Principal & Chief Administrator',
};

export const INITIAL_AUTHORIZED_MODERATORS: AuthorizedModerator[] = [
  {
    id: 'mod-1',
    name: 'Mrs. Alvarez (Guidance Office)',
    email: 'alvarez.guidance@cityhigh.edu',
    accessCode: 'MOD-7821',
    assignedBy: 'Head Administrator',
    createdAt: '2026-09-28',
    status: 'active',
  },
  {
    id: 'mod-2',
    name: 'Mr. David (Student Affairs)',
    email: 'david.prefect@cityhigh.edu',
    accessCode: 'MOD-4920',
    assignedBy: 'Head Administrator',
    createdAt: '2026-09-29',
    status: 'active',
  },
];

export const NOTE_COLOR_MAP: Record<NoteColor, NoteColorTheme> = {
  blush: {
    bg: '#FFF0F3',
    border: '#FFCCD5',
    headerText: '#C93B57',
    bodyText: '#3D2F33',
    authorText: '#874D59',
    badgeBg: '#FFE4EB',
  },
  sky: {
    bg: '#F0F8FF',
    border: '#CDE5FC',
    headerText: '#2361A6',
    bodyText: '#2B394A',
    authorText: '#4A698F',
    badgeBg: '#DFEEFD',
  },
  mint: {
    bg: '#F0FFF7',
    border: '#C2F3D9',
    headerText: '#187A50',
    bodyText: '#243D32',
    authorText: '#3B795D',
    badgeBg: '#DBF8EB',
  },
  sunshine: {
    bg: '#FFFDF0',
    border: '#FDECB2',
    headerText: '#A86A14',
    bodyText: '#423722',
    authorText: '#846835',
    badgeBg: '#FEF6D6',
  },
  lilac: {
    bg: '#FBF5FF',
    border: '#E8D5F9',
    headerText: '#7B39B8',
    bodyText: '#382D42',
    authorText: '#6D508A',
    badgeBg: '#F3E8FF',
  },
  coral: {
    bg: '#FFF5F0',
    border: '#FED7C3',
    headerText: '#CC5818',
    bodyText: '#423229',
    authorText: '#945839',
    badgeBg: '#FEE8DC',
  },
};

export const INITIAL_AUTHORIZED_TEACHERS: AuthorizedTeacher[] = [
  {
    id: 't-1',
    name: 'Maam Santos',
    subject: 'Science',
    accessCode: 'SCIENCE2026',
    status: 'approved',
    requestedAt: '2026-09-28',
  },
  {
    id: 't-2',
    name: 'Sir Reyes',
    subject: 'Mathematics',
    accessCode: 'MATH2026',
    status: 'approved',
    requestedAt: '2026-09-28',
  },
  {
    id: 't-3',
    name: 'Maam Garcia',
    subject: 'Filipino',
    accessCode: 'FILIPINO2026',
    status: 'approved',
    requestedAt: '2026-09-29',
  },
  {
    id: 't-4',
    name: 'Sir Mendoza',
    subject: 'HUMSS',
    accessCode: 'HUMSS2026',
    status: 'approved',
    requestedAt: '2026-09-29',
  },
  {
    id: 't-5',
    name: 'Maam Cruz',
    subject: 'STEM',
    accessCode: 'STEM2026',
    status: 'approved',
    requestedAt: '2026-09-30',
  },
  {
    id: 't-6',
    name: 'Sir De Leon',
    subject: 'MAPEH',
    accessCode: 'MAPEH2026',
    status: 'approved',
    requestedAt: '2026-09-30',
  },
];

export const INITIAL_PHOTO_CARDS: PhotoCard[] = [
  {
    id: 'photo-celebration',
    src: teacherCheerImg,
    alt: 'Students celebrating their teacher with flowers and handcrafted cards',
    caption: 'Happy Teachers Day! Thank you for inspiring our dreams 💐',
    scale: 1,
    rotation: -1.5,
  },
  {
    id: 'photo-mentorship',
    src: teacherMentoringImg,
    alt: 'Teacher patiently guiding students around class project table',
    caption: 'Every day you help us discover what we are capable of 🔬✨',
    scale: 1,
    rotation: 2,
  },
  {
    id: 'photo-1',
    src: chalkboardImg,
    alt: 'Classroom chalkboard full of appreciation notes',
    caption: 'Our heartfelt chalkboard notes & memories ✨',
    scale: 1,
    rotation: -2,
  },
  {
    id: 'photo-2',
    src: desksImg,
    alt: 'Bright morning classroom desks ready for lessons',
    caption: 'Where all the inspiration begins every morning ☀️',
    scale: 1,
    rotation: 2.5,
  },
];

export const INITIAL_STUDENT_NOTES: StudentNote[] = [
  {
    id: 'note-1',
    subject: 'Mathematics',
    teacherName: 'Sir Reyes',
    studentName: 'Hannah & Miguel',
    grade: 'Grade 10 - Diamond',
    gradeLevel: 'Grade 7-10',
    strandOrSubject: 'Mathematics',
    message: 'Thank you Sir Reyes for turning quadratic equations and calculus from intimidating puzzles into exciting brain exercises! You never let us feel bad for asking questions.',
    color: 'sunshine',
    likes: 18,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    status: 'approved',
  },
  {
    id: 'note-2',
    subject: 'Science',
    teacherName: 'Maam Santos',
    studentName: 'Alyssa Gomez',
    grade: 'Grade 9 - Sapphire',
    gradeLevel: 'Grade 7-10',
    strandOrSubject: 'Science',
    message: 'Happy Teacher’s Day Ma’am Santos! Your biology and chemistry lab experiments made our high school year unforgettable. Thank you for igniting my dream to become a doctor! 🔬✨',
    color: 'mint',
    likes: 24,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    status: 'approved',
    teacherComment: 'Alyssa, keep nurturing that bright scientific curiosity! You are going to achieve wonderful things.',
    teacherCommentAuthor: 'Maam Santos',
    teacherCommentTime: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: 'note-3',
    subject: 'Filipino',
    teacherName: 'Maam Garcia',
    studentName: 'Carlo Mendoza',
    grade: 'Grade 8 - Rizal',
    gradeLevel: 'Grade 7-10',
    strandOrSubject: 'Filipino',
    message: 'Maraming salamat po Ma’am Garcia sa pagtuturo sa amin na mahalin ang sarili nating wika, kasaysayan, at panitikan. Ang inyong mga kwento ay laging puno ng puso.',
    color: 'blush',
    likes: 15,
    createdAt: Date.now() - 1000 * 60 * 60 * 16,
    status: 'approved',
  },
  {
    id: 'note-4',
    subject: 'HUMSS',
    teacherName: 'Sir Mendoza',
    studentName: 'Bea & Section Curie',
    grade: 'Grade 12 - HUMSS A',
    gradeLevel: 'SHS',
    strandOrSubject: 'HUMSS',
    message: 'Sir Mendoza, thank you for teaching us to think critically, speak with conviction, and care deeply about community issues. Your mentorship has prepared us for college and life.',
    color: 'lilac',
    likes: 31,
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
    status: 'approved',
  },
  {
    id: 'note-5',
    subject: 'STEM',
    teacherName: 'Maam Cruz',
    studentName: 'Nathan P.',
    grade: 'Grade 11 - STEM 1',
    gradeLevel: 'SHS',
    strandOrSubject: 'STEM',
    message: 'To Ma’am Cruz: Physics used to be so intimidating, but the way you explain kinematics with funny everyday examples made everything click! Happy Teachers Day! 🚀',
    color: 'sky',
    likes: 22,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    status: 'approved',
  },
  {
    id: 'note-6',
    subject: 'MAPEH',
    teacherName: 'Sir De Leon',
    studentName: 'Jericho Santos',
    grade: 'Grade 7 - Acacia',
    gradeLevel: 'Grade 7-10',
    strandOrSubject: 'MAPEH',
    message: 'Sir De Leon, thank you for always bringing music, rhythm, and positive energy to our mornings! You made arts and sports feel welcoming for all of us.',
    color: 'coral',
    likes: 19,
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    status: 'approved',
  },
];
