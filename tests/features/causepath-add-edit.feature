Feature: Add / Edit CausePath
  Cause URL paths that are automatically generated from Cause names should be unique.

  @cause
  Scenario Outline: Cause user submits a Cause name that generates a path that is already used by other Causes
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to edit the cause I represent
    And <noOfDuplicatePaths> other Cause has the same path
    When I submit valid and complete cause details
    Then I should receive a 200 http status code
    And I should be redirected to <redirect>
    And I want to toggle cause online status
    When I submit the toggle online status request
    Then I should receive a 200 http status code
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    And my cause path should have <pathExtension> appended to the slug

    Examples:
      | noOfDuplicatePaths | redirect                   | pathExtension |
      | 1                  | '/dashboard/cause/charity' | '.1'          |
      | 5                  | '/dashboard/cause/charity' | '.5'          |
