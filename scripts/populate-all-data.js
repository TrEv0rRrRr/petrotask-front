/**
 * Script to populate positions, tasks, activities, and task programmings in the database
 * Run with: node scripts/populate-all-data.js
 */

const API_BASE_URL = "http://localhost:8080/api/v1";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ0cmV2b3IiLCJ0ZW5hbnRJZCI6MSwiaWF0IjoxNzY0NDg5MzI2LCJleHAiOjE3NjUwOTQxMjZ9.n4qUiPqf7XwjfWgcz6Qthb_GtqyilOLaoiL3YlrQLGjDD8Cz8qE8XVXKZAXKJ2Vr";

// Mock data for positions
const mockPositions = [
  {
    title: "Gerente General",
    description:
      "Responsable de la dirección estratégica y operativa de la empresa",
  },
  {
    title: "Supervisor de Operaciones",
    description:
      "Supervisa las actividades operativas diarias y coordina equipos de trabajo",
  },
  {
    title: "Operario de Producción",
    description: "Ejecuta tareas de producción y mantenimiento de equipos",
  },
  {
    title: "Técnico Especialista",
    description:
      "Proporciona soporte técnico especializado y mantenimiento preventivo",
  },
  {
    title: "Analista de Calidad",
    description:
      "Realiza controles de calidad y análisis de procesos productivos",
  },
  {
    title: "Asistente Administrativo",
    description: "Brinda apoyo administrativo y gestiona documentación",
  },
  {
    title: "Jefe de Logística",
    description:
      "Coordina actividades de almacén, distribución y cadena de suministro",
  },
  {
    title: "Director de Recursos Humanos",
    description:
      "Lidera estrategias de talento humano y desarrollo organizacional",
  },
  {
    title: "Coordinador de Seguridad",
    description: "Implementa protocolos de seguridad y prevención de riesgos",
  },
  {
    title: "Especialista en Mantenimiento",
    description: "Realiza mantenimiento predictivo y correctivo de maquinaria",
  },
];

// Mock data for tasks
const mockTasks = [
  {
    title: "Inspección de Equipos",
    description: "Realizar inspección general de equipos de carga",
    status: "PENDING",
    activityId: 1,
    employeeId: 105,
  },
  {
    title: "Mantenimiento Preventivo",
    description: "Ejecutar rutina de mantenimiento preventivo",
    status: "IN_PROGRESS",
    activityId: 1,
    employeeId: 107,
  },
  {
    title: "Limpieza de Área",
    description: "Limpiar y organizar área de trabajo",
    status: "COMPLETED",
    activityId: 2,
    employeeId: 109,
  },
  {
    title: "Verificación de Seguridad",
    description: "Verificar cumplimiento de protocolos de seguridad",
    status: "PENDING",
    activityId: 2,
    employeeId: 108,
  },
];

// Mock data for activities
const mockActivities = [
  {
    activityCode: "ACT001",
    description: "Carga de Contenedores",
    expectedTime: new Date().toISOString(),
    weekNumber: 1,
    activityStatus: "PENDING",
    zoneOrigin: 1,
    locationOrigin: 1,
    zoneDestination: 1,
    locationDestination: 2,
  },
  {
    activityCode: "ACT002",
    description: "Descarga de Mercancía",
    expectedTime: new Date().toISOString(),
    weekNumber: 1,
    activityStatus: "IN_PROGRESS",
    zoneOrigin: 1,
    locationOrigin: 2,
    zoneDestination: 2,
    locationDestination: 3,
  },
  {
    activityCode: "ACT003",
    description: "Mantenimiento de Equipos",
    expectedTime: new Date().toISOString(),
    weekNumber: 2,
    activityStatus: "COMPLETED",
    zoneOrigin: 2,
    locationOrigin: 3,
    zoneDestination: 3,
    locationDestination: 5,
  },
  {
    activityCode: "ACT004",
    description: "Inspección de Seguridad",
    expectedTime: new Date().toISOString(),
    weekNumber: 2,
    activityStatus: "PENDING",
    zoneOrigin: 1,
    locationOrigin: 1,
    zoneDestination: 1,
    locationDestination: 2,
  },
];

// Mock data for task programmings
const mockTaskProgrammings = [
  {
    taskId: 1,
    resourceType: "EQUIPMENT",
    resourceId: 1001,
    programmingStatus: "PENDING",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    taskId: 2,
    resourceType: "PERSONNEL",
    resourceId: 105,
    programmingStatus: "IN_PROGRESS",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 7200000).toISOString(),
  },
  {
    taskId: 3,
    resourceType: "VEHICLE",
    resourceId: 1002,
    programmingStatus: "COMPLETED",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 1800000).toISOString(),
  },
  {
    taskId: 4,
    resourceType: "EQUIPMENT",
    resourceId: 1003,
    programmingStatus: "PENDING",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 5400000).toISOString(),
  },
];

async function populatePositions() {
  console.log("🚀 Starting to populate positions...\n");

  for (const position of mockPositions) {
    try {
      const response = await fetch(`${API_BASE_URL}/positions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(position),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Position created: ${position.title} (ID: ${data.id})`);
      } else {
        const error = await response.text();
        console.error(
          `❌ Failed to create position "${position.title}":`,
          error
        );
      }
    } catch (error) {
      console.error(
        `❌ Error creating position "${position.title}":`,
        error.message
      );
    }
  }

  console.log("\n✨ Positions population completed!\n");
}

async function populateTasks() {
  console.log("🚀 Starting to populate tasks...\n");

  for (const task of mockTasks) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Task created: ${task.title} (ID: ${data.id})`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed to create task "${task.title}":`, error);
      }
    } catch (error) {
      console.error(`❌ Error creating task "${task.title}":`, error.message);
    }
  }

  console.log("\n✨ Tasks population completed!\n");
}

async function populateActivities() {
  console.log("🚀 Starting to populate activities...\n");

  for (const activity of mockActivities) {
    try {
      const response = await fetch(`${API_BASE_URL}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(activity),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(
          `✅ Activity created: ${activity.description} (ID: ${data.id})`
        );
      } else {
        const error = await response.text();
        console.error(
          `❌ Failed to create activity "${activity.description}":`,
          error
        );
      }
    } catch (error) {
      console.error(
        `❌ Error creating activity "${activity.description}":`,
        error.message
      );
    }
  }

  console.log("\n✨ Activities population completed!\n");
}

async function populateTaskProgrammings() {
  console.log("🚀 Starting to populate task programmings...\n");

  for (const programming of mockTaskProgrammings) {
    try {
      const response = await fetch(`${API_BASE_URL}/task-programmings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(programming),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(
          `✅ Task programming created for task ${programming.taskId} (ID: ${data.id})`
        );
      } else {
        const error = await response.text();
        console.error(
          `❌ Failed to create task programming for task ${programming.taskId}:`,
          error
        );
      }
    } catch (error) {
      console.error(
        `❌ Error creating task programming for task ${programming.taskId}:`,
        error.message
      );
    }
  }

  console.log("\n✨ Task programmings population completed!\n");
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("    DATABASE POPULATION SCRIPT");
  console.log("    Positions, Tasks, Activities & Task Programmings");
  console.log("═══════════════════════════════════════════════════\n");

  // Order matters: Positions -> Activities -> Tasks -> Task Programmings
  await populatePositions();
  await populateActivities();
  await populateTasks();
  await populateTaskProgrammings();

  console.log("═══════════════════════════════════════════════════");
  console.log("    ✅ DATABASE POPULATION COMPLETED!");
  console.log("═══════════════════════════════════════════════════");
}

// Run the script
main().catch((error) => {
  console.error("💥 Fatal error:", error.message);
  process.exit(1);
});
