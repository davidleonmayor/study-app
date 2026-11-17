const insforgeUrl = process.env.EXPO_PUBLIC_INSFORGE_URL;
const insforgeAnonKey = process.env.EXPO_PUBLIC_INSFORGE_ANON_KEY;
const seedEmail = process.env.INSFORGE_SEED_EMAIL;
const seedPassword = process.env.INSFORGE_SEED_PASSWORD;

if (!insforgeUrl || !insforgeAnonKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_INSFORGE_URL or EXPO_PUBLIC_INSFORGE_ANON_KEY.",
  );
}

if (!seedEmail || !seedPassword) {
  throw new Error(
    "Missing INSFORGE_SEED_EMAIL or INSFORGE_SEED_PASSWORD. " +
      "Pass them as environment variables; never commit the password.",
  );
}

const subjectSeeds = [
  {
    name: "Matemáticas Discretas",
    resources: [
      {
        title: "Lógica proposicional",
        description:
          "Resumen de operadores lógicos, tablas de verdad y equivalencias.",
        fileName: "logica-proposicional.pdf",
        fileType: "pdf",
      },
      {
        title: "Teoría de grafos",
        description: "Apuntes introductorios sobre grafos, recorridos y árboles.",
        fileName: "teoria-de-grafos.md",
        fileType: "md",
      },
    ],
  },
  {
    name: "Programación Móvil",
    resources: [
      {
        title: "Componentes de React Native",
        description:
          "Referencia rápida de componentes, propiedades y estilos nativos.",
        fileName: "componentes-react-native.txt",
        fileType: "txt",
      },
      {
        title: "Navegación con Expo Router",
        description:
          "Guía práctica para layouts, rutas agrupadas y navegación protegida.",
        fileName: "expo-router.pdf",
        fileType: "pdf",
      },
    ],
  },
  {
    name: "Bases de Datos",
    resources: [
      {
        title: "Modelo relacional",
        description:
          "Conceptos de entidades, relaciones, claves y normalización.",
        fileName: "modelo-relacional.md",
        fileType: "md",
      },
      {
        title: "Consultas SQL esenciales",
        description:
          "Ejemplos de SELECT, JOIN, agrupaciones y subconsultas.",
        fileName: "consultas-sql.txt",
        fileType: "txt",
      },
    ],
  },
] as const;

const request = async <T>(
  path: string,
  init: RequestInit,
  token: string,
): Promise<T> => {
  const response = await fetch(`${insforgeUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const body = (await response.json().catch(() => null)) as
    | { message?: string; error?: string }
    | T
    | null;

  if (!response.ok) {
    const errorMessage =
      body && typeof body === "object" && ("message" in body || "error" in body)
        ? body.message ?? body.error
        : null;
    throw new Error(
      `${response.status} ${response.statusText}: ${
        errorMessage ?? "InsForge request failed"
      }`,
    );
  }

  return body as T;
};

const seed = async () => {
  const session = await request<{ accessToken?: string; user?: { id: string } }>(
    "/api/auth/sessions?client_type=mobile",
    {
      method: "POST",
      body: JSON.stringify({ email: seedEmail, password: seedPassword }),
    },
    insforgeAnonKey,
  );

  if (!session?.user) {
    throw new Error("Could not sign in: no user returned.");
  }

  if (!session.accessToken) {
    throw new Error("Could not sign in: no access token returned.");
  }

  const accessToken = session.accessToken;
  const subjectNames = subjectSeeds.map(({ name }) => name);
  const encodedNames = subjectNames.map((name) => `"${name}"`).join(",");
  const existingSubjects = await request<{ id: string }[]>(
    `/api/database/records/subjects?select=id&name=in.(${encodeURIComponent(
      encodedNames,
    )})`,
    { method: "GET" },
    accessToken,
  );

  const existingSubjectIds = existingSubjects.map((subject) => subject.id);

  if (existingSubjectIds.length > 0) {
    await request(
      `/api/database/records/subjects?id=in.(${existingSubjectIds.join(",")})`,
      { method: "DELETE" },
      accessToken,
    );
  }

  const subjects = await request<{ id: string; name: string }[]>(
    "/api/database/records/subjects?select=id,name",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(subjectNames.map((name) => ({ name }))),
    },
    accessToken,
  );

  if (!subjects || subjects.length !== subjectSeeds.length) {
    throw new Error("Could not create all seed subjects.");
  }

  const resources = subjects.flatMap(
    (subject: { id: string; name: string }, subjectIndex: number) =>
      subjectSeeds[subjectIndex].resources.map((resource) => ({
        subject_id: subject.id,
        title: resource.title,
        description: resource.description,
        file_key: `${subject.id}/${resource.fileName}`,
        file_name: resource.fileName,
        file_type: resource.fileType,
      })),
  );

  await request(
    "/api/database/records/resources",
    {
      method: "POST",
      body: JSON.stringify(resources),
    },
    accessToken,
  );

  console.log(
    `Seed complete: ${subjects.length} subjects and ${resources.length} resources created.`,
  );
};

seed().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
