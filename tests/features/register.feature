Feature: Register Page and Form
  Only non-logged-in (guest) users can view this page.

  @register
  Scenario: Guest user can view register page
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to view the register page
    When I view the register page
    Then I should receive a 200 http status code
    And I should see the "Sign up to CoinFunnel" title
    And I should see public links
    And I should 'see' access links
    And I should 'not see' private links

  @register
  Scenario Outline: Logged-in users cannot view register page
    Given Im a <role> user
    And I 'am' logged in
    And I want to view the register page
    When I view the register page
    Then I should receive a 302 http status code
    And I should be redirected to the <dashboard> page

    Examples:
      | role      | dashboard            |
      | "cause"   | "/dashboard/cause"   |
      | "donator" | "/dashboard/donator" |
      | "admin"   | "/dashboard/admin"   |

  @register
  Scenario Outline: Guest user submits invalid first name
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to register
    When I submit an <invalid_first_name> name with a valid last name
    Then I should receive a 400 http status code
    And I should receive a first name <invalid_notice> notice

    Examples:
      | invalid_first_name | invalid_notice                                      |
      | "empty"            | "First name is empty"                               |
      | "toolong"          | "First name should be less than 50 characters long" |

  @register
  Scenario Outline: Guest user submits invalid last name
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to register
    When I submit a valid first name with an <invalid_last_name> name
    Then I should receive a 400 http status code
    And I should receive a last name <invalid_notice> notice

    Examples:
      | invalid_last_name | invalid_notice                                     |
      | "empty"           | "Last name is empty"                               |
      | "toolong"         | "Last name should be less than 50 characters long" |

  @register
  Scenario Outline: Guest user submits entirely invalid credentials
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to register
    When I submit an <invalid_first_name> name and an <invalid_last_name> name
    Then I should receive a 400 http status code
    And I should receive a first name <invalid_firstname_notice> notice
    And I should receive a last name <invalid_lastname_notice> notice

    Examples:
      | invalid_first_name  | invalid_last_name | invalid_firstname_notice                             | invalid_lastname_notice                             |
      | "empty"             | "empty"           | "First name is empty"                                | "Last name is empty"                                |
      | "empty"             | "toolong"         | "First name is empty"                                | "Last name should be less than 50 characters long"  |
      | "toolong"           | "empty"           | "First name should be less than 50 characters long"  | "Last name is empty"                                |
      | "toolong"           | "toolong"         | "First name should be less than 50 characters long"  | "Last name should be less than 50 characters long"  |

  @register
  Scenario Outline: Non-logged-in users attempt to register despite already being registered
    Given Im a <role> user
    And my account registration is 'confirmed'
    And I 'am not' logged in
    And I want to register
    When I submit recognised credentials to the register endpoint
    Then I should receive a 404 http status code
    And I should receive a 'Email already exists in the system' notice

    Examples:
      | role      |
      | "cause"   |
      | "donator" |

  @register
  Scenario Outline: Logged-in users attempt to register again
    Given Im a <role> user
    And I 'am' logged in
    And I want to register
    When I submit recognised credentials to the register endpoint
    Then I should receive a 403 http status code

    Examples:
      | role      |
      | "cause"   |
      | "donator" |

  @register
  Scenario Outline: Guest user successfully registers
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to register
    And I want to register as a <role> user
    When I submit valid credentials to the register endpoint
    Then I should receive a 200 http status code
    And I should receive a <header_text> header update notice
    And I should receive a <body_text> body update notice

    Examples:
      | role      | header_text       | body_text |
      | "cause"   | "Almost there..." | "A registration confirmation email has been sent to you. Please follow the steps in the email to complete registration." |
      | "donator" | "Almost there..." | "A registration confirmation email has been sent to you. Please follow the steps in the email to complete registration." | 

  @register
  Scenario Outline: Guest user is prevented from registering as an admin user
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to register
    And I want to register as a <role> user
    When I submit valid credentials to the register endpoint
    Then I should receive a 400 http status code
    And I should receive a user role <invalid_notice> notice

    Examples:
      | role      | invalid_notice                        |
      | "admin"   | "User account type is not recognised" |

  @register
  Scenario Outline: Guest user submits invalid role
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to register
    When I submit an invalid role
    Then I should receive a 400 http status code
    And I should receive a user role <invalid_notice> notice
