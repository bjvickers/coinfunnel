Feature: 404 Page
  All users may be presented with the 404 page whilst using the system.
  
  Scenario Outline: All users are correctly presented with the 404 page
    Given Im a <role> user
    And I <state> logged in
    And I want to view the "does-not-exist" page
    When I view the "does-not-exist" page
    Then I should receive a 404 http status code
    And I should receive a 404 error page
    And I should see public links
    And I should <accessLinks> access links
    And I should <privateLinks> private links
    
    Examples:
      | role      | state      | accessLinks    | privateLinks |
      | "guest"   | "am not"   | "see"          | "not see"    |
      | "cause"   | "am"       | "not see"      | "see"        |
      | "donator" | "am"       | "not see"      | "see"        |
      | "cause"   | "am"       | "not see"      | "see"        |
