Feature: Change Password Page and Form
  The password change feature for logged-IN users.

  @change_password
  Scenario Outline: Logged-out users are prevented from changing their password on the internal change-password form
    Given Im a <role> user
    And I 'am not' logged in
    And I want to change my existing password
    When I submit a valid internal change password request
    Then I should receive a 403 http status code

    Examples:
      | role      |
      | "guest"   |
      | "cause"   |
      | "donator" |
      | "admin"   |

  @change_password
  Scenario: Admin user prevented from changing their password on the internal change-password form
    Given Im a 'admin' user
    And I 'am' logged in
    And I want to change my existing password
    When I submit a valid internal change password request
    Then I should receive a 403 http status code

  @change_password
  Scenario Outline: Logged-in users submit invalid new passwords on the internal change-password form
    Given Im a <role> user
    And I 'am' logged in
    And I want to change my existing password
    When I submit an <invalid_password> internal change password request
    Then I should receive a 400 http status code
    And I should receive an invalid password notice

    Examples:
      | role      | invalid_password |
      | "cause"   | 'empty'          |
      | "cause"   | 'tooshort'       |
      | "cause"   | 'toolong'        |
      | "donator" | 'empty'          |
      | "donator" | 'tooshort'       |
      | "donator" | 'toolong'        |

  @change_password
  Scenario Outline: Logged-in users submit non-matching new passwords on the internal change-password form
    Given Im a <role> user
    And I 'am' logged in
    And I want to change my existing password
    When I submit an internal change password request with non-matching new passwords
    Then I should receive a 400 http status code
    And I should receive a non-matching passwords notice

    Examples:
      | role      |
      | "cause"   | 
      | "donator" |

  @change_password
  Scenario Outline: Logged-in users submit incorrect current password on the internal change-password form
    Given Im a <role> user
    And I 'am' logged in
    And I want to change my existing password
    When I submit a valid internal change password request with an incorrect current password
    Then I should receive a 401 http status code
    And I should receive a current-password 'Current password is incorrect' notice

    Examples:
      | role      |
      | "cause"   | 
      | "donator" |

  @change_password
  Scenario Outline: Logged-in successfully change their password on the internal change-password form
    Given Im a <role> user
    And I 'am' logged in
    And I want to change my existing password
    When I submit a valid internal change password request
    Then I should receive a 200 http status code
    And I should be redirected to <redirect>

    Examples:
      | role      | redirect                     |
      | "cause"   | "/dashboard/cause/account"   |
      | "donator" | "/dashboard/donator/account" |
