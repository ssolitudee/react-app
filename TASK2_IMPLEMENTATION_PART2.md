# Task 2: Implementation Instructions - Part 2

Continue implementing Task 2 - Basic Frontend UI Components for the Inventory Analyzer AI project with these steps:

## 7. Create AgentSelection Component

1. Create `src/components/AgentSelection.tsx`
2. Implement agent selection with:
   - Two selection buttons arranged horizontally
   - Summary Agent with ChartPie icon from Heroicons
   - Chatbot Agent with ChatBubble icon from Heroicons
   - Visual styling: selected agent has red transparent fill, unselected is grayed out
   - Integration with context API for agent selection state management
3. Create `src/components/AgentSelection.test.tsx` for component testing

## 8. Create FAQ Grid Component

1. Create `src/components/FAQGrid.tsx`
2. Implement FAQ grid with:
   - 2x2 layout of frequently asked questions
   - Question mark icon and "Frequently Asked Questions" heading
   - Cards with question title and answer text
   - Fixed height of 65px per card to prevent vertical overflow
   - Full-width layout stretching from sidebar to screen edge

## 9. Create Chat Input Component

1. Create `src/components/ChatInput.tsx`
2. Implement chat input with:
   - Text input field with placeholder text
   - Send button with paper airplane icon
   - Form submission handler
   - Integration with context to add messages

## 10. Create Message Components

1. Create `src/components/MessageBubble.tsx`
2. Implement message bubbles with:
   - Different styling for user vs. AI messages
   - User messages aligned right with darker background
   - AI messages aligned left with lighter background
   - Timestamps and name labels

## 11. Create Chat Container Component

1. Create `src/components/ChatContainer.tsx`
2. Implement chat container with:
   - Scrollable message list area
   - Auto-scroll to latest message
   - Empty state when no messages exist
   - Message grouping and spacing
