
export interface User {
  id: string;
  username: string;
  email: string;
  is_udp: boolean;
  ruf: string;
  current_band?: Band | null;
}

export interface Band {
  id: string;
  name: string;
  members: User[];
  created_at: string;
  is_approved: boolean;
}

export interface Reservation {
  id: string;
  band: Band;
  room: Room;
  start_time: string;
  end_time: string;
  guests: User[];
  created_at: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
