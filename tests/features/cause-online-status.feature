Feature: Cause Online Status
  Cause user should be able to toggle the online status of the Cause they represent. 
  Causes can be put online only when the Cause profile details are complete.

  @cause
  Scenario Outline: Non-logged-in users cannot toggle cause online status
    Given Im a <role> user
    And I 'am not' logged in
    And I want to toggle cause online status
    When I submit the toggle online status request
    Then I should receive a 403 http status code

    Examples:
      | role      |
      | "guest"   |
      | "cause"   |
      | "donator" |
      | "admin"   |
  
  @cause
  Scenario Outline: Logged-in, non-Cause users cannot toggle cause online status
    Given Im a <role> user
    And I 'am' logged in
    And I want to toggle cause online status
    When I submit the toggle online status request
    Then I should receive a 403 http status code

    Examples:
      | role      |
      | "donator" |
      | "admin"   |

  @cause @wip @todo
  Scenario: Cause user with an offline Cause can put the Cause online
    Given Im a 'cause' user
    And I 'am' logged in
    And I have completed my charity profile details
    And my charity online status is currently 'offline'
    And I want to toggle cause online status
    When I submit the toggle online status request
    Then I should receive a 200 http status code
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then my cause state list should show "online-status" as "online"
    And I want to view the explore page
    And I specify search for 'Altruistic Research Computation And Donation Engine'
    When I submit the explore search
    Then I should receive a 200 http status code
    And there should be 1 causes listed
