---
name: Feature request
about: Suggest an idea for this project
title: "[FEATURE] Add setup script for environment initialization"
labels: ''
assignees: ronerog

---

## Feature Request

### Is your feature request related to a problem?
Describe the problem you are trying to solve.

Example:
"I'm always frustrated when [...]"

---

### Describe the solution you'd like
Describe the feature or improvement you would like to see implemented.

Example:
- Add a setup script (`setup.sh` or `setup.ps1`)
- Automatically install dependencies
- Generate required configuration files
- Prepare the project workspace

Example usage:

```bash
npm run setup

### Describe alternatives you've considered

Currently, the project setup can be done manually by following the documentation and installing dependencies step by step. However, this approach may lead to configuration mistakes and inconsistencies between development environments.

Another alternative would be using containerization tools such as Docker to standardize the environment. While this can provide consistency, it may introduce additional complexity for contributors who prefer running the project directly on their local machine.

Because of this, introducing a simple setup script (`setup.sh` or `setup.ps1`) would be a lightweight and accessible solution to streamline the development setup process.
