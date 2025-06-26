# Task 2: Implementation Instructions - Part 3

Complete the implementation of Task 2 - Basic Frontend UI Components for the Inventory Analyzer AI project with these final steps:

## 12. Integrate All Components in App.tsx

1. Open `src/App.tsx`
2. Replace the default content with the structure:
   - Wrap everything in the AppContext provider
   - Create a responsive layout with Sidebar and main content area
   - Add conditional rendering: show WelcomeScreen when no chat is selected
   - Position FAQ Grid below the welcome screen and above the chat input
   - Place Chat Input at the bottom of the screen
   - Show Chat Container when a chat is selected

## 13. Implement UI/UX Requirements

1. Update AgentSelection to be toggle/selectable:
   - Selected agent gets red transparent fill
   - Unselected agent is grayed out
   - No navigation/redirect on selection, just toggle mode

2. Adjust FAQ Grid layout:
   - Make it full-width from sidebar to right edge of screen
   - Reduce height of cards (65-70px)
   - Arrange in a 2x2 table format
   - Position just above message box

3. Ensure message box is always visible:
   - Should be visible below FAQ/selection
   - Not only after selecting chatbot

## 14. Test and Fix TypeScript Issues

1. Run `npm test` to verify component tests are working
2. Fix any TypeScript typing issues in test files
3. Update mock context values in test files to match the actual context structure

## 15. Final Testing and Optimization

1. Run `npm start` to see the application in action
2. Verify all UI requirements are met:
   - Dark theme with custom red accent
   - Responsive layout that works on different screen sizes
   - Welcome screen with agent selection
   - FAQ grid in 2x2 format
   - Message input always visible
   - All content fits on screen without scrolling
   - Agent selection toggle works correctly

3. Fix any remaining compiler warnings or errors

## Next Steps

After completing Task 2, proceed to Task 3: Develop Backend API Structure to begin implementing the server-side functionality.
