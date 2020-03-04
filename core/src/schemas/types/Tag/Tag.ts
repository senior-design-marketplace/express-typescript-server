import { Major } from '../Major/Major';

enum TagValues {
    "Programming",
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Data Mining",
    "Virtual Reality",
    "Augmented Reality",
    "Automotive",
    "Robotics",
    "Mechatronics / Automation",
    "Thermal / fluids",
    "Aviation / Aerospace Systems",
    "Biomedical",
    "Product Development",
    "Energy / Sustainability",
    "Competition",
    "Thermal / Fluids / Energy Sustainability",
    "Site / Civil Design",
    "Structural",
    "Transportation"
}

export type Tag = (keyof typeof TagValues) | Major;