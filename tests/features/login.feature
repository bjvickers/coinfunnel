Feature: Login Page and Form
  Only non-logged-in (guest) users can view this page.

  Scenario: Guest user can view login page
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to view the login page
    When I view the login page
    Then I should receive a 200 http status code
    And I should see the "Sign in to CoinFunnel" title
    And I should see public links
    And I should 'see' access links
    And I should 'not see' private links
    
  Scenario Outline: Non-guest users cannot view login page
    Given Im a <role> user
    And I 'am' logged in
    And I want to view the login page
    When I view the login page
    Then I should receive a 302 http status code
    And I should be redirected to the <dashboard> page

    Examples:
      | role      | dashboard            |
      | "cause"   | "/dashboard/cause"   |
      | "donator" | "/dashboard/donator" |
      | "admin"   | "/dashboard/admin"   |

  Scenario Outline: Guest user submits invalid email address
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to log in
    When I submit an <invalid_email> email address with a valid password
    Then I should receive a 400 http status code
    And I should receive an email <invalid_notice> notice

    Examples:
      | invalid_email | invalid_notice                                           |
      | "empty"       | "Email address is invalid"                               |
      | "invalid"     | "Email address is invalid"                               |
      | "toolong"     | "Email address should be less than 60 characters long"   |

  Scenario Outline: Guest user submits invalid password
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to log in
    When I submit a valid email address with an <invalid_password> password
    Then I should receive a 400 http status code
    And I should receive a password <invalid_notice> notice

    Examples:
      | invalid_password | invalid_notice                                   |
      | "empty"          | "Password should be between 10 and 60 characters long"   |
      | "tooshort"       | "Password should be between 10 and 60 characters long"   |
      | "toolong"        | "Password should be between 10 and 60 characters long"   |

  Scenario Outline: Guest user submits entirely invalid credentials
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to log in
    When I submit an <invalid_email> email address and an <invalid_password> password
    Then I should receive a 400 http status code
    And I should receive an email <invalid_email_notice> notice
    And I should receive a password <invalid_password_notice> notice

    Examples:
      | invalid_email   | invalid_password | invalid_email_notice                                    | invalid_password_notice                        |
      | "empty"         | "empty"          | "Email address is invalid"                              | "Password should be between 10 and 60 characters long" |
      | "empty"         | "tooshort"       | "Email address is invalid"                              | "Password should be between 10 and 60 characters long" |
      | "empty"         | "toolong"        | "Email address is invalid"                              | "Password should be between 10 and 60 characters long" |
      | "invalid"       | "empty"          | "Email address is invalid"                              | "Password should be between 10 and 60 characters long" |
      | "invalid"       | "tooshort"       | "Email address is invalid"                              | "Password should be between 10 and 60 characters long" |
      | "invalid"       | "toolong"        | "Email address is invalid"                              | "Password should be between 10 and 60 characters long" |
      | "toolong"       | "empty"          | "Email address should be less than 60 characters long"  | "Password should be between 10 and 60 characters long" |
      | "toolong"       | "tooshort"       | "Email address should be less than 60 characters long"  | "Password should be between 10 and 60 characters long" |
      | "toolong"       | "toolong"        | "Email address should be less than 60 characters long"  | "Password should be between 10 and 60 characters long" |

  Scenario: Guest user does not exist in the system
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to log in
    When I submit valid and correct credentials
    Then I should receive a 400 http status code
    And I should receive a "User not found" notice

  Scenario Outline: Non-logged-in user has not confirmed their email address
    Given Im a <role> user
    And my account registration is 'pre_confirmed'
    And I 'am not' logged in
    And I want to log in
    When I submit valid and correct credentials
    Then I should receive a 401 http status code
    And I should receive a "Email not confirmed. Another registration confirmation email has now been sent." notice

    Examples:
      | role      |
      | "cause"   |
      | "donator" |

  Scenario Outline: Non-logged-in user has requested a password reset but has not yet completed that action
    Given Im a <role> user
    And my account registration is 'confirmed'
    And my password reset status is pre_confirmed
    And I 'am not' logged in
    And I want to log in
    When I submit valid and correct credentials
    Then I should receive a 401 http status code
    And I should receive a "Password reset request has not been completed. Another password reset email has now been sent." notice

    Examples:
      | role      |
      | "cause"   |
      | "donator" |

  Scenario Outline: Non-logged-in user attempts login with valid but incorrect credentials
    Given Im a <role> user
    And my account registration is 'confirmed'
    And I 'am not' logged in
    And I want to log in
    When I submit a valid email address with an incorrect password
    Then I should receive a 401 http status code
    And I should receive a "Password is incorrect" notice

    Examples:
      | role      |
      | "cause"   |
      | "donator" |
      | "admin"   |

  Scenario Outline: Non-logged-in user attempts to log in when already logged in
    Given Im a <role> user
    And my account registration is 'confirmed'
    And I 'am' logged in
    And I want to log in
    When I submit recognised credentials
    Then I should receive a 403 http status code

    Examples:
      | role      |
      | "cause"   |
      | "donator" |
      | "admin"   |

  Scenario Outline: Non-logged-in user successfully logs in for the first time
    Given Im a <role> user
    And my account registration is 'confirmed'
    And I 'am not' logged in
    And I want to log in
    When I submit recognised credentials
    Then I should receive a 200 http status code
    And I should receive an authentication token
    And I should be redirected to <redirect>
    And I 'am' logged in
    And I want to view the cause-dashboard page
    When I view the cause-dashboard page
    Then my fullname should be correctly displayed
    And my email should be correctly displayed
    And my last-logged-in notice should state 'No previous sign-in'
    
    Examples:
      | role      | redirect               |
      | "cause"   | "/dashboard/cause"     |
      #| "donator" | "/dashboard/donator"   | Not yet implemented
      #| "admin"   | "/dashboard/admin"     | Not yet implemented
