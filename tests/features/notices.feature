Feature: System Notices
  Users should be notified of new system notices, should be able to mark them as read, and
  should be able to delete them.

  @notices
  Scenario Outline: New notices are flagged on the users dashboard
    Given Im a <role> user
    And I 'am' logged in
    And <no_of_notices> notices are added to the system
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then the new-notice-badge should show <no_of_notices> unread messages
    And I should see the correct notice information

    Examples:
      | role      | no_of_notices |
      | "cause"   | 1             |
      | "cause"   | 2             |

  @notices
  Scenario: Users can mark new notices as 'read'
    Given Im a 'cause' user
    And I 'am' logged in
    And I have 1 'unread' notice
    And I trigger the read notice link
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then the new-notice-badge should show 0 unread messages
    And I should see the correct notice information

  @notices
  Scenario: Users can mark existing notices as 'read' without breaking the system
    Given Im a 'cause' user
    And I 'am' logged in
    And I have 1 'unread' notice
    And I trigger the read notice link
    And I trigger the read notice link
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then the new-notice-badge should show 0 unread messages
    And I should see the correct notice information

  @notices
  Scenario: Users can delete unread notices
    Given Im a 'cause' user
    And I 'am' logged in
    And I have 1 'unread' notice
    And I trigger the delete notice link
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then the new-notice-badge should show 0 unread messages
    And there should be 0 notices listed

  @notices
  Scenario: Users can delete read notices
    Given Im a 'cause' user
    And I 'am' logged in
    And I have 1 'unread' notice
    And I trigger the read notice link
    And I trigger the delete notice link
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then the new-notice-badge should show 0 unread messages
    And there should be 0 notices listed

  @notices @wip
  Scenario Outline: New users are only presented with notices that are relevant to them
    Given Im a 'guest' user
    And I 'am not' logged in
    And there are <previous_notapplicable> system notices released prior to my registration that are not applicable to me
    And there are <previous_applicable> system notices released prior to my registration that are applicable to me
    When I register as a cause user # @todo implement registration and register-confirm in one step
    And I 'am' logged in
    And I want to view the cause-dashboard page
    And I view the cause-dashboard page
    Then the new-notice-badge should show <no_of_unread> unread messages
    And there should be <no_of_listed> notices listed

    Examples:
      | previous_notapplicable | previous_applicable | no_of_unread | no_of_listed |
      | 0                      | 0                   | 0            | 0            |
      #| 1                      | 0                   | 0            | 0            |
      #| 0                      | 1                   | 1            | 1            |
      #| 1                      | 1                   | 1            | 1            |
