Feature: Cause Dashboard
  Only Cause users can view the Cause dashboard

  @cause
  Scenario: Guest user cannot view the Cause dashboard
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then I should receive a 302 http status code
    And I should be redirected to the "/login" page

  @cause
  Scenario Outline: Non-Cause users cannot view the Cause dashboard
    Given Im a <role> user
    And I 'am' logged in
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then I should receive a 302 http status code
    And I should be redirected to the <dashboard> page

    Examples:
      | role      | dashboard              |
      | "admin"   | "/dashboard/admin"     |
      | "donator" | "/dashboard/donator"   |
 
  @cause
  Scenario: Registered, confirmed Cause-users can view their Cause Dashboard
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then I should receive a 200 http status code
    And I should see public links
    And I should "not see" access links
    And I should "see" private links
    And my cause state list should show "details" as "incomplete"
    And my cause state list should show "online-status" as "offline"

  @cause @wip @todo
  Scenario: Cause user with a complete charity profile is presented with the correct cause status
    Given Im a 'cause' user
    And I 'am' logged in
    And I have completed my charity profile details
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then my cause state list should show "details" as "complete"
    And my cause state list should show "online-status" as "offline"
    And I should see my cause details populated in the cause details form

  @cause @current
  Scenario Outline: Cause user can see their number of volunteer miners
    Given Im a 'cause' user
    And I 'am' logged in
    And I have completed my charity profile details
    And my charity online status is currently 'online'
    And there are <no_of_miners> volunteer miners for my charity    
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then <no_of_miners> should be displayed as the miner count for my charity

    Examples:
      | no_of_miners |
      | 0                           |
      | 1                           |
      | 10                          |
