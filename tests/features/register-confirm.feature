Feature: Register Confirm Page
  Only non-logged-in (guest) users can view this page.

  @register
  Scenario Outline: Logged-in users are prevented from viewing register-confirm page
    Given Im a <role> user
    And I 'am' logged in
    And I have a valid register token
    And I want to view the register-confirm page
    When I view the register-confirm page
    Then I should receive a 302 http status code
    And I should be redirected to the <dashboard> page

    Examples:
      | role      | dashboard            |
      | "cause"   | "/dashboard/cause"   |
      | "donator" | "/dashboard/donator" |
      | "admin"   | "/dashboard/admin"   |

  @register
  Scenario Outline: Non-logged-in users attempt to view the 'register-confirm' page with invalid tokens
    Given Im a <role> user
    And I 'am not' logged in
    And I have an invalid register token
    And I want to view the register-confirm page
    When I view the register-confirm page
    Then I should receive a 500 http status code
    And I should receive a 500 error page

    Examples:
      | role      |
      | "guest"   |
      | "cause"   |
      | "donator" |
  
  @register
  Scenario Outline: Non-logged-in users successfuly complete registration using valid email confimation token
    Given Im a 'cause' user
    And my account registration is 'pre_confirmed'
    And I 'am not' logged in
    And I have a valid register token
    And I want to view the register-confirm page
    When I view the register-confirm page
    Then I should receive a 200 http status code
    And the page should indicate registration complete
    
    Examples:
      | role      |
      | "cause"   |
      | "donator" |
