'use strict'

const PostCauseConstraints = {
  cause_name: {
    length: {
      maximum: 100,
      message: `Charity name should be less than 100 characters long`
    }
  },
  cause_incorporation_id: {
    length: {
      maximum: 100,
      message: `Charity incorporation identifier should be less than 100 characters long`
    }
  },
  cause_incorporation_date: {
    length: {
      maximum: 100,
      message: `Charity incorporation date should be less than 100 characters long`
    }
  },
  cause_phone: {
    length: {
      maximum: 100,
      message: `Charity phone number should be less than 50 characters long`
    }
  },
  cause_email: {
    length: {
      maximum: 100,
      message: `Charity email must be less than 100 characters long`
    }
  },
  cause_website: {
    length: {
      maximum: 100,
      message: `Charity website must be less than 100 characters long`
    }
  },
  cause_country: {
    length: {
      maximum: 100,
      message: `Country name should be less than 100 characters long`
    }
  },
  cause_address1: {
    length: {
      maximum: 100,
      message: `Charity address line 1 must be less than 100 characters long`
    }
  },
  cause_address2: {
    length: {
      maximum: 100,
      message: `Charity address line 2 must be less than 100 characters long`
    }
  },
  cause_address3: {
    length: {
      maximum: 100,
      message: `Charity address line 3 must be less than 100 characters long`
    }
  },
  cause_desc: {
    length: {
      maximum: 1000,
      message: `Charity description should be less than 1000 characters long`
    }
  },
  cause_keyword1: {
    length: {
      maximum: 30,
      message: `Keywords/keyword phrases should be less than 30 characters long`
    }
  },
  cause_keyword2: {
    length: {
      maximum: 30,
      message: `Keywords/keyword phrases should be less than 30 characters long`
    }
  },
  cause_keyword3: {
    length: {
      maximum: 30,
      message: `Keywords/keyword phrases should be less than 30 characters long`
    }
  }
}

module.exports = PostCauseConstraints
