import {
  UserX,
  Shield,
  Users,
  HardHat,
  Lightbulb,
  Trash2,
  Car,
  Trees,
  Droplets,
  Accessibility,
  Eye,
  AlertTriangle,
  Wrench,
  Map,
  Scissors,
  FlaskConical,
  Search,
  Laptop,
  Siren,
  Wind,
  Layers,
} from "lucide-react";

export const ROLE_ICONS = {
  Unassigned: UserX,
  ADMIN: Shield,
  "Public Relations Officer": Users,
  "Street Maintenance Operator": HardHat,
  "Public Lighting Operator": Lightbulb,
  "Waste Management Operator": Trash2,
  "Urban Mobility Operator": Car,
  "Green Spaces Operator": Trees,
  "Water Infrastructure Operator": Droplets,
  "Accessibility Officer": Accessibility,
  "Environmental Surveillance Officer": Eye,
  "Road Safety Inspector": AlertTriangle,
  "Public Lighting Technician": Wrench,
  "Urban Mobility Planner": Map,
  "Green Maintenance Technician": Scissors,
  "Water Quality Inspector": FlaskConical,
  "Accessibility Inspector": Search,
  "Digital Services Technician": Laptop,
  "Emergency Response Liaison": Siren,
  "Noise and Air Quality Technician": Wind,
  "External Maintainer": HardHat,
  Multiple: Layers,
};

export const getRoleIcon = (role, size, color) => {
  if (Array.isArray(role)) {
    if (role.length > 1) {
      return <Layers size={size} color={color} />;
    }
    if (role.length === 1) {
      const IconComponent = ROLE_ICONS[role[0]] || UserX;
      return <IconComponent size={size} color={color} />;
    }
    return <UserX size={size} color={color} />;
  }
  const IconComponent = ROLE_ICONS[role] || UserX;
  return <IconComponent size={size} color={color} />;
};
