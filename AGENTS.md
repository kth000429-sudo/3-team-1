# Agent Rules for 3-team Project

이 프로젝트에서 작업할 때는 다음 규칙을 엄격히 준수해야 합니다.

## 1. Design System: shadcn/ui
- 모든 UI 디자인 시 **shadcn/ui**를 최우선적으로 활용합니다.
- 새로운 UI 요소가 필요할 경우, 직접 구현하기 전에 shadcn/ui에서 제공하는 컴포넌트가 있는지 먼저 확인합니다.
- 디자인의 일관성을 위해 shadcn/ui의 테마와 스타일 가이드를 따릅니다.

## 2. Component Installation
- shadcn/ui 컴포넌트를 추가할 때는 반드시 **터미널 명령어**를 사용합니다.
- 모든 명령어는 프로젝트 루트 디렉토리(`./3-team/`)에서 실행되어야 합니다.
- **명령어 예시:**
  ```bash
  npx shadcn-ui@latest add [component-name]
  ```
  또는 프로젝트 설정에 따라:
  ```bash
  npx shadcn@latest add [component-name]
  ```

## 3. General Principles
- 신규 컴포넌트 추가 후 `components/ui` 폴더에 정상적으로 생성되었는지 확인합니다.
- 컴포넌트 설치 후 필요한 의존성이 있다면 자동으로 설치되도록 허용하거나 직접 설치합니다.
- 코드 작성 시 가독성과 유지보수성을 최우선으로 고려합니다.
