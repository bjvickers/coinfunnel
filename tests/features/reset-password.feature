Feature: Reset Password Page and Form
  Only non-logged-in (guest) users can view this page.

  @reset_password
  Scenario: Non-logged-in user can view reset-password page
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to view the reset-password page
    When I view the reset-password page
    Then I should receive a 200 http status code
    And I should see the "Reset your password" title
    And I should see public links
    And I should 'see' access links
    And I should 'not see' private links

  @reset_password
  Scenario Outline: Logged-in users cannot view reset-password page
    Given Im a <role> user
    And I 'am' logged in
    And I want to view the reset-password page
    When I view the reset-password page
    Then I should receive a 302 http status code
    And I should be redirected to the <dashboard> page

    Examples:
      | role      | dashboard            |
      | "cause"   | "/dashboard/cause"   |
      | "donator" | "/dashboard/donator" |
      | "admin"   | "/dashboard/admin"   |

  @reset_password
  Scenario Outline: Non-logged-in users attempt to submit invalid email addresses on the reset-password form
    Given Im a <role> user
    And my account registration is 'confirmed'
    And my password reset status is confirmed
    And I 'am not' logged in
    And I want to reset my password
    When I submit an <invalid_email> email address on the reset-password form
    Then I should receive a 400 http status code
    And I should receive an email <invalid_notice> notice

    Examples:
      | role      | invalid_email | invalid_notice                                          |
      | "cause"   | "empty"       | "Email address is invalid"                              |
      | "cause"   | "invalid"     | "Email address is invalid"                              |
      | "cause"   | "toolong"     | "Email address should be less than 60 characters long"  |
      | "donator" | "empty"       | "Email address is invalid"                              |
      | "donator" | "invalid"     | "Email address is invalid"                              |
      | "donator" | "toolong"     | "Email address should be less than 60 characters long"  |
      | "admin"   | "empty"       | "Email address is invalid"                              |
      | "admin"   | "invalid"     | "Email address is invalid"                              |
      | "admin"   | "toolong"     | "Email address should be less than 60 characters long"  |
  
  @reset_password
  Scenario: Non-logged-in user does not exist in the system
    Given Im a 'guest' user
    And I 'am not' logged in
    And I want to reset my password
    When I submit valid and correct credentials on the reset-password form
    Then I should receive a 400 http status code
    And I should receive a "User not found" notice

  @reset_password
  Scenario: Non-logged-in user cannot reset admin user password
    Given Im a 'admin' user
    And I 'am not' logged in
    And I want to reset my password
    When I submit valid and correct credentials on the reset-password form
    Then I should receive a 500 http status code

  @reset_password
  Scenario Outline: Non-logged-in user has not confirmed their email address
    Given Im a <role> user
    And my account registration is 'pre_confirmed'
    And my password reset status is confirmed
    And I 'am not' logged in
    And I want to reset my password
    When I submit valid and correct credentials on the reset-password form
    Then I should receive a 401 http status code
    And I should receive a "Email not confirmed. Another registration request email has now been sent to you." notice

    Examples:
      | role      |
      | "cause"   |
      | "donator" |

  @reset_password
  Scenario Outline: Non-logged-in user has already requested a password reset
    Given Im a <role> user
    And my account registration is 'confirmed'
    And my password reset status is pre_confirmed
    And I 'am not' logged in
    And I want to reset my password
    When I submit valid and correct credentials on the reset-password form
    Then I should receive a 401 http status code
    And I should receive a "Password reset request is already in progress. Another password reset email has now been sent." notice

    Examples:
      | role      |
      | "cause"   |
      | "donator" |

  @reset_password
  Scenario Outline: Non-logged-in user successfully submits the reset-password form
    Given Im a <role> user
    And my account registration is 'confirmed'
    And my password reset status is confirmed
    And I 'am not' logged in
    And I want to reset my password
    When I submit valid and correct credentials on the reset-password form
    Then I should receive a 200 http status code
    And I should receive a <header_text> header update notice
    And I should receive a <body_text> body update notice

    Examples:
      | role      | header_text    | body_text |
      | "cause"   | "Next step..." | "A reset password confirmation email has been sent. Please follow the steps in the email to reset your password." |
      | "donator" | "Next step..." | "A reset password confirmation email has been sent. Please follow the steps in the email to reset your password." |
