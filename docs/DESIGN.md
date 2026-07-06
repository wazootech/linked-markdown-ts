## DESIGN.md for "Linked Markdown" - A Nostalgic Collaborative Workspace

### 1. Vision & Goals

"Linked Markdown" is a project that merges the social ease of a classic social gathering with the architectural clarity of a modern knowledge graph synchronized with a search index. The goal is a highly collaborative, local-first knowledge management system where data structures are visually integrated into a shared virtual landscape. The environment provides context while minimizing cognitive friction and information overload.

### 2. User Interface (UI) and Experience (UX)

#### 2.1 Aesthetic Constraint: 1970s/80s Dithered Pixel Art

All visual elements, from window borders to icons and user avatars, must employ a distinct dithered pixel-art style, taking direct cues from the visual density of the source asset (`2df3ba8699af4b9945c3438b0383152a148f4c87.jpg`). There should be no modern smoothing effects; instead, the interface should lean into 1970s and 80s technology aesthetics, occasionally employing subtle VHS-style chromatic aberration filters during transitions. The final visual output must feel like an anachronic early computing interface.

#### 2.2 Shared Workspace: The "Social Blanket"

*   **Shared Canvas:** The primary workspace is a multi-user shared canvas, metaphorically representing the picnic blanket. Users place markdown files and task items onto this canvas.
*   **Color Palette:** The palette should be restricted to a high-contrast set of vibrant greens, deep blues, and warm earth tones. The specific multi-colored pattern of the picnic blanket serves as the color key for visualizing different item structures and categorization.

#### 2.3 User Interaction: Avatar-driven Collaboration

Users are represented by stylized, dithered avatars. All multi-user interactions are rendered as the avatars physically gathering and sharing items on the blanket, reinforcing the collaborative nature of the workspace.

### 3. Architecture and Data

#### 3.1 The Central Data Mesh: The Grid in the Sky

*   **Metaphor:** The geometric structure floating in the upper-center of the sky in the reference image represents the overarching "Worlds" primitive, synchronizing the semantic knowledge graph with the local search index.
*   **Data Representation:** This "Data Mesh" contains all high-level, structured, multidimensional data. Users can zoom into specific nodes in this sky-bound structure to view complex relationships between items. 
*   **Schema & Integrity:** Every structured note operates on strict schemas defining its `type`. The grid visually represents the underlying SHACL validation and SPARQL reasoning that keeps the markdown knowledge base intact.

#### 3.2 Environmental Integration

*   **Active Activity 'Fields':** The green fields represent active user activity streams and immediate world memory context.
*   **Long-term Storage 'Mountains':** The distant mountains are visual benchmarks for data volume and cold-storage repositories. Data here is visually compressed.
*   **Ephemeral Data 'Clouds':** The transient clouds signify dynamic data that is temporary, such as unlinked drafts or cached search queries.

### 4. System Components

#### 4.1 Node Processor & CLI 

Handles all backend computational tasks, file parsing, and graph integrity. This layer utilizes a Python-based Wiki CLI to manage the semantic knowledge base, supported by Deno and Go microservices for rapid local file indexing and search synchronization.

#### 4.2 Collaboration Layer (CL)

Manages real-time data synchronization. The frontend interface, built with SvelteKit, ensures a lag-free, local-first multi-user environment on the Shared Canvas. 

### 5. Design Targets and Visual Benchmarks

The primary aesthetic reference for this system is the pixel-perfect, dithered illustration style of the provided image. The specific composition, including the floating geometric data-grid in the sky and the period-setting, serves as the benchmark for all generated UI.

*   **Primary Design Artifact:** [Source Asset - Verbatim Reference](2df3ba8699af4b9945c3438b0383152a148f4c87.jpg) (Filename: `2df3ba8699af4b9945c3438b0383152a148f4c87.jpg`)

#### 5.1 Palette Map and Pattern Key

| Component | Target Color (based on dithered palette) | Visual Dithering Pattern Source |
| :--- | :--- | :--- |
| Environment (Base) | Vibrant Dithered Grass Green | Grass texture in reference image |
| Central Architecture | High-Contrast White (Data Points) / Electric Blue (Sky) | Sky grid and points in reference image |
| Workspace (Blanket) | Dynamic Multi-Color Pattern (Vibrant Cyan, Orange, Pink, Green) | Blanket pattern in reference image |
| Long-term Storage | Warm Brown/Red Mountain Dither | Mountain range texture in reference image |

*Note: All palette mappings must employ the specific dithering pattern technique rather than flat colors.*