Feature: Reset Password Confirm Page and Form
  The password change feature for logged-OUT users.

  @reset_password
  Scenario Outline: Logged-in users are prevented from viewing reset-password-confirm page
    Given Im a <role> user
    And I 'am' logged in
    And I want to view the reset-password-confirm page
    When I view the reset-password-confirm page
    Then I should receive a 302 http status code
    And I should be redirected to the <dashboard> page

    Examples:
      | role      | dashboard            |
      | "cause"   | "/dashboard/cause"   |
      | "donator" | "/dashboard/donator" |
      | "admin"   | "/dashboard/admin"   |

  @reset_password
  Scenario Outline: Users attempt to view the 'reset-password-confirm' page with invalid tokens
    Given Im a <role> user
    And I 'am not' logged in
    And I have an invalid reset-password token
    And I want to view the reset-password-confirm page
    When I view the reset-password-confirm page
    Then I should receive a 500 http status code
    And I should receive a 500 error page

    Examples:
      | role      |
      | "guest"   |
      | "cause"   |
      | "admin"   |
      | "donator" |

  @reset_password
  Scenario Outline: Non-logged-in users successfully view the reset-password-confirm page
    Given Im a <role> user
    And my account registration is 'confirmed'
    And my password reset status is pre_confirmed
    And I 'am not' logged in
    And I have a valid reset-password token
    And I want to view the reset-password-confirm page
    When I view the reset-password-confirm page
    Then I should receive a 200 http status code
    And I should see the 'Enter your new password' title
    And I should see public links
    And I should 'see' access links
    And I should 'not see' private links

    Examples:
      | role      |
      | "cause"   |
      | "donator" |

  @reset_password
  Scenario Outline: Non-logged-in users submit invalid new passwords
    Given Im a <role> user
    And my account registration is 'confirmed'
    And my password reset status is pre_confirmed
    And I 'am not' logged in
    And I have a valid reset-password token
    And I want to submit my new password
    When I submit the reset-password-confirm form with an <invalid_password> password
    Then I should receive a 400 http status code
    And I should receive a password <invalid_notice> notice

    Examples:
      | role      | invalid_password | invalid_notice                                               |
      | "cause"   | "empty"          | "New password should be between 10 and 60 characters long"   |
      | "cause"   | "tooshort"       | "New password should be between 10 and 60 characters long"   |
      | "cause"   | "toolong"        | "New password should be between 10 and 60 characters long"   |
      | "donator" | "empty"          | "New password should be between 10 and 60 characters long"   |
      | "donator" | "tooshort"       | "New password should be between 10 and 60 characters long"   |
      | "donator" | "toolong"        | "New password should be between 10 and 60 characters long"   |

  @reset_password
  Scenario Outline: Non-logged-in user submits non-matching passwords
    Given Im a <role> user
    And my account registration is 'confirmed'
    And my password reset status is pre_confirmed
    And I 'am not' logged in
    And I have a valid reset-password token
    And I want to submit my new password
    When I submit the reset-password-confirm form non-matching passwords
    Then I should receive a 400 http status code
    And I should receive an 'Passwords do not match' password notice

    Examples:
      | role      |
      | "cause"   |
      | "donator" |

  @reset_password
  Scenario Outline: Users attempt to submit a password reset with an invalid token
    Given Im a <role> user
    And I 'am not' logged in
    And I have an invalid reset-password token
    And I want to submit my new password
    When I submit the reset-password-confirm form with valid passwords
    Then I should receive a 500 http status code
    And I should receive a 'Something went wrong. Sorry for this, please try again.' notice

    Examples:
      | role      |
      | "guest"   |
      | "cause"   |
      | "admin"   |
      | "donator" |
  
  @reset_password
  Scenario Outline: Non-logged-in users successfully submit a password reset
    Given Im a <role> user
    And my account registration is 'confirmed'
    And my password reset status is pre_confirmed
    And I 'am not' logged in
    And I have a valid reset-password token
    And I want to submit my new password
    When I submit the reset-password-confirm form with valid passwords
    Then I should receive a 200 http status code
    And I should receive a <header_text> header update notice
    And I should receive a <body_text> body update notice
    And the old password should no longer work
    And I should receive a 401 http status code
    And the new password should work
    And I should receive a 200 http status code

    Examples:
      | role      | header_text | body_text |
      | "cause"   | "All done"  | "Your password has been successfully reset. You can now sign in." |
      | "donator" | "All done"  | "Your password has been successfully reset. You can now sign in." |

  @reset_password
  Scenario: Non-logged-in user cannot reset admin password
    Given Im a 'admin' user
    And my account registration is 'confirmed'
    And my password reset status is pre_confirmed
    And I 'am not' logged in
    And I have a valid reset-password token
    And I want to submit my new password
    When I submit the reset-password-confirm form with valid passwords
    Then I should receive a 500 http status code
