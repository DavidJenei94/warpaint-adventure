function User(
  id,
  email,
  password,
  name,
  role,
  premiumEndDate,
  premiumRecurring,
  created,
  token = ''
) {
  this.id = id;
  this.email = email;
  this.password = password;
  this.name = name;
  this.role = role;
  this.premiumEndDate = premiumEndDate;
  this.premiumRecurring = premiumRecurring;
  this.created = created;
  this.token = token;
}

module.exports = User;
