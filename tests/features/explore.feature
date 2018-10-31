Feature: Explore Page
  All users can view this page.

  @explore
  Scenario Outline: Non-logged-in users can view the explore page
    Given Im a <role> user
    And I 'am not' logged in
    And I want to view the explore page
    When I view the explore page
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

  @explore
  Scenario Outline: Logged-in users can view the explore page
    Given Im a <role> user
    And I 'am' logged in
    And I want to view the explore page
    When I view the explore page
    Then I should receive a 200 http status code
    And I should see public links
    And I should "not see" access links
    And I should "see" private links

    Examples:
      | role     |
      | "cause"  |
      | "donator"|
      | "admin"  |

  @explore
  Scenario Outline: When n causes exist, a default search returns n causes up to the page limit
    Given Im a 'guest' user
    And I 'am not' logged in
    And there are <no_of_causes> causes in the search engine
    And I want to view the explore page
    When I view the explore page
    Then I should receive a 200 http status code
    And there should be <no_of_causes_displayed> causes listed

    Examples:
      | no_of_causes | no_of_causes_displayed |
      | 0            | 0                      |
      | 5            | 4                      |
      | 10           | 4                      |
  
  @explore
  Scenario Outline: User can sort causes by name-asc, name-desc and newest-first
    Given Im a 'guest' user
    And I 'am not' logged in
    And there are <no_of_causes> causes in the search engine
    And I want to view the explore page
    And I select <sort_type>
    When I submit the explore search
    Then I should receive a 200 http status code
    And there should be <no_of_causes_displayed> causes listed
    And the <sort_type> option should be selected
    And the expected causes displayed are <expected_causes>

    Examples:
      | no_of_causes | no_of_causes_displayed | sort_type   | expected_causes |
      | 0            | 0                      | "name-asc"  | ''              |
      | 5            | 4                      | "name-asc"  | '3,1,2,5'       |
      | 0            | 0                      | "name-desc" | ''              |
      | 5            | 4                      | "name-desc" | '4,5,2,1'       |
      | 0            | 0                      | "newest"    | ''              |
      | 5            | 4                      | "newest"    | '5,4,3,2'       |

  @explore
  Scenario Outline: User can see detailed search results information
    Given Im a 'guest' user
    And I 'am not' logged in
    And there are <no_of_causes> causes in the search engine
    And I want to view the explore page
    When I view the explore page
    Then I should receive a 200 http status code
    And the current page number should be <current_page_num>
    And the total number of pages should be <total_page_num>
    And the results per page should be <results_per_page>
    And the total number of results should be <total_num_results>

    Examples:
      | no_of_causes | current_page_num | total_page_num | results_per_page | total_num_results |
      | 0            | 1                | 1              | 4                | 0                 |
      | 5            | 1                | 2              | 4                | 5                 |
      | 10           | 1                | 3              | 4                | 10                |

  @explore
  Scenario Outline: User can search different pages of results
    Given Im a 'guest' user
    And I 'am not' logged in
    And there are 10 causes in the search engine
    And I want to view page <current_page_num> of the explore page
    When I submit the explore search
    Then I should receive a 200 http status code
    And the actual page number should be <calculated_page_num>
    And the number of results listed on the page should be <results_on_page>
    And the previous button should be <prev_button>
    And the next button should be <next_button>

    Examples:
      | current_page_num | calculated_page_num |results_on_page  | prev_button | next_button |
      | -50              | 1                   | 4               | "hidden"    | "visible"   |
      | -1               | 1                   | 4               | "hidden"    | "visible"   |
      | 0                | 1                   | 4               | "hidden"    | "visible"   |
      | 1                | 1                   | 4               | "hidden"    | "visible"   |
      | 2                | 2                   | 4               | "visible"   | "visible"   |
      | 3                | 3                   | 2               | "visible"   | "hidden"    |
      | 4                | 4                   | 0               | "visible"   | "hidden"    |
      | 50               | 50                  | 0               | "visible"   | "hidden"    |

  @explore
  Scenario Outline: User can search different pages of results when using a keyword
    Given Im a 'guest' user
    And I 'am not' logged in
    And there are 11 causes in the search engine
    And I specify search for <keyword>
    And I select <sort_type>
    And I want to view page <current_page_num> of the explore page
    When I submit the explore search
    Then I should receive a 200 http status code
    And the actual page number should be <calculated_page_num>
    And the number of results listed on the page should be <results_on_page>
    And the previous button should be <prev_button>
    And the next button should be <next_button>
    And the cause-search box should be populated with <keyword>
    And the <sort_type> option should be selected
    And the expected causes displayed are <expected_causes>

    Examples:
      | current_page_num | calculated_page_num |results_on_page   | prev_button | next_button| keyword   | sort_type   | expected_causes |
      | -1               | 1                   | 4                | "hidden"    | "visible"  | "charity" | "newest"    | '11,10,9,8'     |
      | 0                | 1                   | 4                | "hidden"    | "visible"  | "charity" | "name-asc"  | '10,8,3,6'      |
      | 1                | 1                   | 4                | "hidden"    | "visible"  | "charity" | "name-desc" | '11,4,9,5'      |
      | 2                | 2                   | 4                | "visible"   | "visible"  | "charity" | "newest"    | '7,6,5,4'       |
      | 3                | 3                   | 3                | "visible"   | "hidden"   | "charity" | "name-asc"  | '9,4,11'        |
      | 50               | 50                  | 0                | "visible"   | "hidden"   | "charity" | "name-desc" | ''              |

  @explore
  Scenario: Whitespace-only keywords are ignored
    Given Im a 'guest' user
    And I 'am not' logged in
    And there are 13 causes in the search engine
    And I want to view the explore page
    And I specify search for '   '
    When I submit the explore search
    Then I should receive a 200 http status code
    And there should be 4 causes listed
    And the cause-search box should be populated with ''
