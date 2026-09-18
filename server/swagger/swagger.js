import swaggerUi from "swagger-ui-express";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Kanhu Charan Sahoo Portfolio & Admin REST API",
    version: "1.0.0",
    description: "Interactive REST API documentation for managing Portfolio content, projects, skills, timeline, messages, and admin authentication.",
    contact: {
      name: "Kanhu Charan Sahoo",
      email: "kanhucharansahoo595@gmail.com",
      url: "https://github.com/9090856788/Portfolio"
    }
  },
  servers: [
    {
      url: "/",
      description: "Current Host Server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter JWT token obtained from /api/v1/user/login"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          fullName: { type: "string", example: "Kanhu Charan Sahoo" },
          email: { type: "string", example: "kanhucharansahoo595@gmail.com" },
          phone: { type: "string", example: "+91 9090856788" },
          aboutMe: { type: "string" },
          role: { type: "string", example: "Frontend Developer" },
          location: { type: "string", example: "Bhubaneswar, Odisha, India" },
          portfolioURL: { type: "string" },
          githubURL: { type: "string" },
          linkedInURL: { type: "string" },
          avatar: {
            type: "object",
            properties: {
              public_id: { type: "string" },
              url: { type: "string" }
            }
          },
          resume: {
            type: "object",
            properties: {
              public_id: { type: "string" },
              url: { type: "string" }
            }
          }
        }
      },
      Project: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string", example: "Full-Stack Portfolio System" },
          description: { type: "string" },
          gitRepoLink: { type: "string" },
          projectLink: { type: "string" },
          technology: { type: "string" },
          stack: { type: "string" },
          deploy: { type: "string" },
          projectBanner: {
            type: "object",
            properties: {
              public_id: { type: "string" },
              url: { type: "string" }
            }
          }
        }
      },
      Skill: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string", example: "React.js" },
          proficiency: { type: "number", example: 92 },
          svg: {
            type: "object",
            properties: {
              public_id: { type: "string" },
              url: { type: "string" }
            }
          }
        }
      },
      Timeline: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string", example: "Frontend Developer" },
          company: { type: "string", example: "Tech Solutions" },
          period: { type: "string", example: "2023 - Present" },
          description: { type: "string" }
        }
      },
      Message: {
        type: "object",
        properties: {
          _id: { type: "string" },
          senderName: { type: "string", example: "Alex Smith" },
          subject: { type: "string", example: "Collaboration Proposal" },
          message: { type: "string", example: "Hello, I am interested in collaborating on a web project." },
          createdAt: { type: "string" }
        }
      }
    }
  },
  paths: {
    "/api/v1/user/profile/portfolio": {
      get: {
        tags: ["Public Portfolio"],
        summary: "Get public portfolio profile details",
        description: "Retrieves owner name, bio, social links, avatar, and resume link.",
        responses: {
          200: {
            description: "Profile retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/user/login": {
      post: {
        tags: ["Authentication"],
        summary: "Admin login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "kanhucharansahoo595@gmail.com" },
                  password: { type: "string", example: "password123" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Logged in successfully with JWT token" },
          401: { description: "Invalid credentials" }
        }
      }
    },
    "/api/v1/user/profile": {
      get: {
        tags: ["Admin Profile"],
        summary: "Get authenticated profile details",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Current user profile" },
          401: { description: "Unauthorized" }
        }
      }
    },
    "/api/v1/user/update/profile": {
      put: {
        tags: ["Admin Profile"],
        summary: "Update user profile and upload new avatar / resume",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fullName: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  aboutMe: { type: "string" },
                  role: { type: "string" },
                  location: { type: "string" },
                  avatarUrl: { type: "string" },
                  resumeUrl: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Profile updated" }
        }
      }
    },
    "/api/v1/project/getall": {
      get: {
        tags: ["Projects"],
        summary: "Get all projects",
        responses: {
          200: {
            description: "List of all projects",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    project: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Project" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/project/add": {
      post: {
        tags: ["Projects"],
        summary: "Add a new project",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  gitRepoLink: { type: "string" },
                  projectLink: { type: "string" },
                  technology: { type: "string" },
                  stack: { type: "string" },
                  deploy: { type: "string" },
                  projectBannerUrl: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Project added successfully" }
        }
      }
    },
    "/api/v1/project/update/{id}": {
      put: {
        tags: ["Projects"],
        summary: "Update existing project",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Project" }
            }
          }
        },
        responses: {
          200: { description: "Project updated successfully" }
        }
      }
    },
    "/api/v1/project/delete/{id}": {
      delete: {
        tags: ["Projects"],
        summary: "Delete a project",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Project deleted successfully" }
        }
      }
    },
    "/api/v1/skill/getall": {
      get: {
        tags: ["Skills"],
        summary: "Get all skills",
        responses: {
          200: { description: "List of all skills" }
        }
      }
    },
    "/api/v1/skill/add": {
      post: {
        tags: ["Skills"],
        summary: "Add a skill",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "proficiency"],
                properties: {
                  title: { type: "string" },
                  proficiency: { type: "number" },
                  svgUrl: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Skill added" }
        }
      }
    },
    "/api/v1/skill/delete/{id}": {
      delete: {
        tags: ["Skills"],
        summary: "Delete a skill",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Skill deleted" }
        }
      }
    },
    "/api/v1/timeline/getall": {
      get: {
        tags: ["Timeline"],
        summary: "Get all timeline milestones",
        responses: {
          200: { description: "List of timeline items" }
        }
      }
    },
    "/api/v1/timeline/add": {
      post: {
        tags: ["Timeline"],
        summary: "Add a timeline entry",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description"],
                properties: {
                  title: { type: "string" },
                  company: { type: "string" },
                  description: { type: "string" },
                  from: { type: "string" },
                  to: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Timeline added" }
        }
      }
    },
    "/api/v1/timeline/delete/{id}": {
      delete: {
        tags: ["Timeline"],
        summary: "Delete a timeline milestone",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Timeline deleted" }
        }
      }
    },
    "/api/v1/message/send": {
      post: {
        tags: ["Messages"],
        summary: "Send a contact form message",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["senderName", "subject", "message"],
                properties: {
                  senderName: { type: "string", example: "Priya Sharma" },
                  subject: { type: "string", example: "Web Project Inquiry" },
                  message: { type: "string", example: "Hello Kanhu, I would like to discuss a React front-end development project." }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Message submitted successfully" }
        }
      }
    },
    "/api/v1/message/getall": {
      get: {
        tags: ["Messages"],
        summary: "Get all contact messages",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of messages" }
        }
      }
    },
    "/api/v1/message/delete/{id}": {
      delete: {
        tags: ["Messages"],
        summary: "Delete a message",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Message deleted" }
        }
      }
    }
  }
};

export const setupSwagger = (app) => {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: `
        .swagger-ui .topbar { background-color: #1a1a2e; }
        .swagger-ui { background: #0f111a; color: #e2e8f0; }
        .swagger-ui .info .title { color: #818cf8; }
        .swagger-ui .scheme-container { background: #16192b; }
      `,
      customSiteTitle: "Portfolio API Documentation"
    })
  );
  app.get("/api/docs.json", (req, res) => {
    res.json(swaggerSpec);
  });
};
