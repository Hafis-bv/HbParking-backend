import { PlateNumbers } from "./plateNumbers";
import { Sessions } from "./sessions";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  plateNumbers: PlateNumbers[];
  balance: number;
  role: string;
  sessions: Sessions[];
}
