// Auth & User
export type UserRole = 'super_admin' | 'staff';

export interface Profile {
  id: string;           // matches auth.users.id
  email: string;
  username: string;
  name: string;
  role: UserRole;
  avatar_url: string | null;
  cross_id: string | null;  // null = super_admin (akses semua)
  created_at: string;
  updated_at: string;
}

// Core Domain
export interface Crossing {
  cross_id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Device {
  device_id: string;
  cross_id: string;
  type: string;
  model: string | null;
  firmware_version: string | null;
  mac_address: string | null;
  mqtt_client_id: string;
  status: 'online' | 'offline';
  last_seen_at: string | null;
  registered_at: string;
}

export interface GateEvent {
  event_id: string;
  cross_id: string;
  event_type: 'GATE_CLOSING' | 'GATE_OPENING';
  trigger_source: string;
  trigger_distance_cm: number | null;
  servo_angle_deg: number;
  previous_state: 'OPEN' | 'CLOSED';
  new_state: 'OPEN' | 'CLOSED';
  offline_buffered: boolean;
  occurred_at: string;
  synced_at: string;
}

export interface SensorReading {
  sensor_id: string;
  device_id: string;
  cross_id: string;
  sensor_type: 'IR' | 'ULTRASONIC';
  raw_value: number;
  unit: string;
  object_detected: boolean;
  distance_cm: number | null;
  recorded_at: string;
  ingested_at: string;
}

export interface Train {
  train_id: string;
  cross_id: string;
  close_event_id: string;
  open_event_id: string | null;
  detected_at: string;
  cleared_at: string | null;
  duration_seconds: number | null;
  max_proximity_cm: number | null;
  resolved_at: string | null;
}

export interface Alert {
  alert_id: string;
  device_id: string;
  cross_id: string;
  alert_type: 'SENSOR_TIMEOUT' | 'WATCHDOG_RESTART' | 'BLIND_SPOT';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  resolved: boolean;
  triggered_at: string;
  resolved_at: string | null;
}

// Analytics
export interface AnalyticsRow {
  tanggal: string;
  total_kereta: number;
  rata_durasi: number;
  durasi_terlama: number;
}

// Realtime Socket Events
export interface GateStatusEvent {
  crossing_name: string;
  event: 'GATE_CLOSING' | 'GATE_OPENING';
}

export interface SensorUpdateEvent {
  crossing_name: string;
  sensor_type: string;
  distance_cm: number | null;
  object_detected: boolean;
  ts: string;
}