# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
---

# Agentic AI Workflow for Task Manager Web App

## Project Overview

**Project Name**: Task Manager  
**Goal**: Build a full-stack web application that supports CRUD operations for managing tasks. 
---

## Tech Stack

| Layer       | Tech Choices                            |
|-------------|------------------------------------------|
| Frontend    | React.js (TypeScript), Vite, TailwindCSS |
| Backend     | Spring Boot (Java 17), Maven, H2 DB      |
| API         | RESTful JSON API                         |
| Deployment  | Netlify (Frontend), Render (Backend)     |
| AI Tooling  | ChatGPT, GitHub Copilot, Codeium         |

---

## Project Structure

task-manager/
├── backend/
│ ├── src/main/java/com/example/taskmanager/
│ └── pom.xml
├── frontend/
│ ├── src/
│ └── vite.config.ts
└── README.md

## Must have Functional Requirements
- A home page that lists all tasks. 
- A form to add a new task. 
- Options to edit and delete existing tasks. 
- Status should be changeable via dropdown. 
- Optional: Sort tasks by status or due date. 
- Form validations (e.g., required fields, character limits). 
- Display error messages on server/API failures. 

## Nice to have Requirements
- Group tasks into categories 
- Add search/filter functionality 
- Deploy the frontend to Vercel or Netlify 
- Deploy the backend to Render, Fly.io or similar 

### Backend Endpoints

| Endpoint               | Method | Description              |
|------------------------|--------|--------------------------|
| `/api/tasks`           | GET    | Retrieve all tasks       |
| `/api/tasks/{id}`      | GET    | Retrieve task by ID      |
| `/api/tasks`           | POST   | Create a new task        |
| `/api/tasks/{id}`      | PUT    | Update existing task     |
| `/api/tasks/{id}`      | DELETE | Delete task by ID        |

- Validate input using Bean Validation (e.g., @NotBlank, @Size) 
- Store data in an H2 database
- Enable CORS to allow frontend-backend communication 

### Entity: Task

```java
public class Task {
  private Long id;

  @NotBlank
  @Size(max = 100)
  private String title;

  @Size(max = 500)
  private String description;

  @Enumerated(EnumType.STRING)
  private Status status;

  private LocalDate dueDate;
}
```
### Status Enum
```java

public enum Status {
  TODO, IN_PROGRESS, DONE;
}
🎨 Frontend UI Features
```

## Testing 
### Backend

Used AI to generate:

- Unit tests with JUnit + Mockito
- Validation test case
#### Example:

```java
@Test
void testCreateTask_InvalidTitle_ShouldFail() {
    TaskDTO invalidTask = new TaskDTO("", "desc", Status.TODO, null);
    mockMvc.perform(post("/api/tasks")
        .content(asJson(invalidTask)))
        .andExpect(status().isBadRequest());
}
```

### Success Criteria
- The app runs successfully and supports all CRUD features. 
- The use of AI tools is clearly documented. 
- The code is structured and understandable. 
- Technical requirements are met. 
- AI usage is reflected upon critically and constructively. 
