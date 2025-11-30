/**
 * Script to populate zones and locations in the database
 * Run with: node scripts/populate-zones-locations.js
 */

const API_BASE_URL = "http://localhost:8080/api/v1";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ0cmV2b3IiLCJ0ZW5hbnRJZCI6MSwiaWF0IjoxNzY0NDg5MzI2LCJleHAiOjE3NjUwOTQxMjZ9.n4qUiPqf7XwjfWgcz6Qthb_GtqyilOLaoiL3YlrQLGjDD8Cz8qE8XVXKZAXKJ2Vr";

// Mock data for zones
const mockZones = [
  { id: 1, tenantId: 1, name: "Zona Norte" },
  { id: 2, tenantId: 1, name: "Zona Sur" },
  { id: 3, tenantId: 1, name: "Zona Este" },
  { id: 4, tenantId: 1, name: "Zona Oeste" },
  { id: 5, tenantId: 1, name: "Zona Central" },
];

// Mock data for locations
const mockLocations = [
  {
    id: 1,
    zoneId: 1,
    street: "Av. Principal 123",
    city: "Lima",
    country: "Perú",
    latitude: -12.0464,
    longitude: -77.0428,
    status: "ACTIVE",
  },
  {
    id: 2,
    zoneId: 1,
    street: "Jr. Comercio 456",
    city: "Lima",
    country: "Perú",
    latitude: -12.0565,
    longitude: -77.0428,
    status: "ACTIVE",
  },
  {
    id: 3,
    zoneId: 2,
    street: "Av. El Sol 789",
    city: "Cusco",
    country: "Perú",
    latitude: -13.5319,
    longitude: -71.9675,
    status: "ACTIVE",
  },
  {
    id: 4,
    zoneId: 2,
    street: "Jr. Triunfo 321",
    city: "Cusco",
    country: "Perú",
    latitude: -13.517,
    longitude: -71.9785,
    status: "INACTIVE",
  },
  {
    id: 5,
    zoneId: 3,
    street: "Av. Brasil 654",
    city: "Arequipa",
    country: "Perú",
    latitude: -16.409,
    longitude: -71.5375,
    status: "ACTIVE",
  },
  {
    id: 6,
    zoneId: 4,
    street: "Jr. Unión 987",
    city: "Trujillo",
    country: "Perú",
    latitude: -8.1116,
    longitude: -79.029,
    status: "ACTIVE",
  },
  {
    id: 7,
    zoneId: 5,
    street: "Av. Garcilazo 147",
    city: "Lima",
    country: "Perú",
    latitude: -12.072,
    longitude: -77.085,
    status: "ACTIVE",
  },
];

async function populateZones() {
  console.log("🚀 Starting to populate zones...\n");

  for (const zone of mockZones) {
    try {
      const response = await fetch(`${API_BASE_URL}/zones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          name: zone.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Zone created: ${zone.name} (ID: ${data.id})`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed to create zone "${zone.name}":`, error);
      }
    } catch (error) {
      console.error(`❌ Error creating zone "${zone.name}":`, error.message);
    }
  }

  console.log("\n✨ Zones population completed!\n");
}

async function populateLocations() {
  console.log("🚀 Starting to populate locations...\n");

  for (const location of mockLocations) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/zones/${location.zoneId}/locations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            street: location.street,
            city: location.city,
            country: location.country,
            latitude: location.latitude,
            longitude: location.longitude,
            status: location.status,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(
          `✅ Location created: ${location.street}, ${location.city} (ID: ${data.id})`
        );
      } else {
        const error = await response.text();
        console.error(
          `❌ Failed to create location "${location.street}":`,
          error
        );
      }
    } catch (error) {
      console.error(
        `❌ Error creating location "${location.street}":`,
        error.message
      );
    }
  }

  console.log("\n✨ Locations population completed!\n");
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("    DATABASE POPULATION SCRIPT");
  console.log("    Zones & Locations");
  console.log("═══════════════════════════════════════════════════\n");

  // First populate zones
  await populateZones();

  // Then populate locations (they depend on zones existing)
  await populateLocations();

  console.log("═══════════════════════════════════════════════════");
  console.log("    ✅ DATABASE POPULATION COMPLETED!");
  console.log("═══════════════════════════════════════════════════");
}

// Run the script
main().catch((error) => {
  console.error("💥 Fatal error:", error.message);
  process.exit(1);
});
