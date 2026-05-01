export type ComplaintStatus =
  | 'Submitted'
  | 'Assigned'
  | 'In_Progress'
  | 'Resolved'
  | 'Reopened';

export interface Hostel {
  hostel_id: number;
  hostel_name: string;
  block: string;
  capacity: number;
}

export interface Category {
  category_id: number;
  category_name: string;
}

export interface Staff {
  staff_id: number;
  name: string;
  role: string;
  contact: string;
}

export interface Student {
  student_id: number;
  name: string;
  room_no: string;
  hostel_id: number;
  contact: string;
}

export interface Complaint {
  complaint_id: number;
  student_id: number;
  category_id: number;
  staff_id: number | null;
  complaint_date: string;
  description: string;
  current_status: ComplaintStatus;
  resolved_at: string | null;
}

export interface StatusLog {
  log_id: number;
  complaint_id: number;
  status: ComplaintStatus;
  updated_time: string;
  note: string | null;
}

/** Joined row from v_recent_complaints */
export interface ComplaintView {
  complaint_id: number;
  description: string;
  complaint_date: string;
  current_status: ComplaintStatus;
  resolved_at: string | null;
  student_id: number;
  student_name: string;
  room_no: string;
  hostel_name: string;
  block: string;
  category_name: string;
  staff_id: number | null;
  staff_name: string | null;
}

/** Row from v_staff_workload */
export interface StaffWorkload {
  staff_id: number;
  staff_name: string;
  role: string;
  total_assigned: number;
  resolved_count: number;
  open_count: number;
}

/** Row from v_avg_resolution_by_category */
export interface AvgResolutionByCategory {
  category_id: number;
  category_name: string;
  resolved_count: number;
  avg_resolution_hours: number;
}

/** Row from v_complaints_by_status */
export interface ComplaintsByStatus {
  status: ComplaintStatus;
  total: number;
}

/** Row from v_complaints_by_hostel */
export interface ComplaintsByHostel {
  hostel_id: number;
  hostel_name: string;
  block: string;
  total_complaints: number;
  open_complaints: number;
}

/** Row from v_complaints_by_category */
export interface ComplaintsByCategory {
  category_id: number;
  category_name: string;
  total_complaints: number;
  resolved_count: number;
  open_count: number;
}

/** Session stored in cookie */
export interface Session {
  role: 'student' | 'staff' | 'admin';
  user_id: number;
  user_name: string;
}
