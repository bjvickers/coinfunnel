Feature: Edit Cause
  Cause user should be able to edit the details of the Cause they represent.

  @cause @wip
  Scenario Outline: Non-logged-in users cannot edit cause details
    Given Im a <role> user
    And I 'am not' logged in
    And I want to edit the cause I represent
    When I submit valid and complete cause details
    Then I should receive a 403 http status code

    Examples:
      | role      |
      | "guest"   |
      | "cause"   |
      | "donator" |
      | "admin"   |
  
  @cause @wip
  Scenario Outline: Logged-in, non-Cause users cannot edit cause details
    Given Im a <role> user
    And I 'am' logged in
    And I want to edit the cause I represent
    When I submit valid and complete cause details
    Then I should receive a 403 http status code

    Examples:
      | role      |
      | "donator" |
      | "admin"   |

  @cause @wip
  Scenario Outline: Cause user submits invalid cause name
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to edit the cause I represent
    When I submit an <invalid_cause_name> cause name
    Then I should receive a 400 http status code
    And I should receive a cause name <invalid_notice> notice

    Examples:
      | invalid_cause_name | invalid_notice                                         |
      | "invalid"          | "Charity name contains invalid characters"             |
      | "toolong"          | "Charity name should be less than 60 characters long"  |

  @cause @wip
  Scenario Outline: Cause user submits invalid keywords
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to edit the cause I represent
    When I submit an <invalid_keyword> cause keyword
    Then I should receive a 400 http status code
    And I should receive a cause keyword <invalid_notice> notice

    Examples:
      | invalid_keyword     | invalid_notice                                                  |
      | "invalid"           | "Keywords contain invalid characters"                           |
      | "toolong"           | "Total length of keywords should be less than 100 characters"   |

  @cause @wip
  Scenario Outline: Cause user submits entirely invalid cause details
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to edit the cause I represent
    When I submit entirely invalid cause details
    Then I should receive a 400 http status code
    And I should receive a cause name <invalid_name_notice> notice
    And I should receive a cause keyword <invalid_keyword_notice> notice

    Examples:
      | invalid_name_notice                         | invalid_keyword_notice                 |
      | 'Charity name contains invalid characters'  | "Keywords contain invalid characters"  |
  
  @cause @wip
  Scenario: Cause user submits a charity name that has already been taken
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to edit the cause I represent
    When I submit a duplicate cause name
    Then I should receive a 400 http status code
    And I should receive a cause name 'The charity name has already been taken' notice

  @cause @wip
  Scenario: Cause user can successfully edit Cause details
    Given Im a 'cause' user
    And I 'am' logged in
    And I want to edit the cause I represent
    When I submit valid and complete cause details
    Then I should receive a 200 http status code
    And I should be redirected to '/dashboard/cause'
    And I want to view the explore page
    And I specify search for 'Altruistic Research Computation And Donation Engine'
    When I submit the explore search
    Then I should receive a 200 http status code
    And there should be 0 causes listed
