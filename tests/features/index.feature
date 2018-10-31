Feature: Index Page
  All users can view this page.
  
  @index
  Scenario Outline: Non-logged-in users can view index page
    Given Im a <role> user
    And I 'am not' logged in
    And I want to view the index page
    When I view the index page
    Then I should receive a 200 http status code
    And I should see public links
    And I should "see" access links
    And I should "not see" private links

    Examples:
      | role      |
      | "guest"   |
      | "cause"   |
      | "donator" |
      | "admin"   |

  @index
  Scenario Outline: Logged-in users can view index page
    Given Im a <role> user
    And I 'am' logged in
    And I want to view the index page
    When I view the index page
    Then I should receive a 200 http status code
    And I should see public links
    And I should "not see" access links
    And I should "see" private links
    
    Examples:
      | role     |
      | "cause"  |
      | "donator"|
      | "admin"  |

  @index @wip
  Scenario Outline: Users can see the total historic number of unique volunteer miners
    Given Im a 'guest' user
    And I 'am not' logged in
    And there is a historic total of <all_system_historic_contributors> unique volunteer miners across all charities
    And I want to view the index page
    When I view the index page
    Then <all_system_historic_contributors> should be displayed as the historic unique volunteer miner count across all charities
    
    Examples:
      | all_system_historic_contributors |
      | 0                                |
      | 1                                |
      | 10                               |
