import {
  Droplets,
  Accessibility,
  Waves,
  Lightbulb,
  Trash2,
  TrafficCone,
  Construction,
  Trees,
  Wrench,
} from "lucide-react";

export const CATEGORY_ICONS = {
  "Water Supply - Drinking Water": Droplets,
  "Architectural Barriers": Accessibility,
  "Sewer System": Waves,
  "Public Lighting": Lightbulb,
  Waste: Trash2,
  "Road Signs and Traffic Lights": TrafficCone,
  "Roads and Urban Furnishings": Construction,
  "Public Green Areas and Playgrounds": Trees,
  Other: Wrench,
};

export const getCategoryIcon = (category, size, color = "#3D5A80") => {
  const IconComponent = CATEGORY_ICONS[category] || Wrench;
  return <IconComponent size={size} color={color} />;
};
