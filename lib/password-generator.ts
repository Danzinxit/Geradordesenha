const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export class PasswordBruteForce {
  private charset: string;
  private currentPassword: string[];
  private length: number;
  private commonPatterns: string[] = [];

  constructor(
    useUppercase = true,
    useLowercase = true,
    useNumbers = true,
    useSpecial = true,
    length = 4,
    userInfo?: { name: string; email: string; birthDate?: string }
  ) {
    this.charset = '';
    if (useLowercase) this.charset += LOWERCASE;
    if (useUppercase) this.charset += UPPERCASE;
    if (useNumbers) this.charset += NUMBERS;
    if (useSpecial) this.charset += SPECIAL;
    this.length = length;
    this.currentPassword = Array(length).fill(this.charset[0]);

    if (userInfo) {
      const { name, email, birthDate } = userInfo;
      const nameLower = name.toLowerCase();
      const emailLower = email.toLowerCase();
      const [emailUser] = emailLower.split('@');
      const year = new Date().getFullYear();
      const birthYears = Array.from({ length: 70 }, (_, i) => (year - 70 + i).toString());
      
      // Extended common patterns based on user info
      const patterns = [
        nameLower,
        nameLower.charAt(0).toUpperCase() + nameLower.slice(1),
        emailUser,
        ...birthYears.map(year => `${nameLower}${year}`),
        ...birthYears.map(year => `${emailUser}${year}`),
        nameLower.split('').reverse().join(''),
        emailUser.split('').reverse().join(''),
        `${nameLower}123456`,
        `${nameLower}12345`,
        `${nameLower}1234`,
        `${nameLower}123`,
        `${emailUser}123456`,
        `${emailUser}12345`,
        `${emailUser}1234`,
        `${emailUser}123`,
        `${nameLower}!@#`,
        `${nameLower}!!!`,
        `${nameLower}###`,
        `${nameLower}$$$`,
        `${emailUser}!@#`,
        `${nameLower}password`,
        `${nameLower}pass`,
        `Password${nameLower}`,
        `Pass${nameLower}`,
        `${nameLower}qwerty`,
        `${emailUser}qwerty`,
        `${nameLower}abc123`,
        `${emailUser}abc123`,
        `${nameLower}admin`,
        `${emailUser}admin`,
        `admin${nameLower}`,
        `admin${emailUser}`,
      ];

      // Adiciona padrões baseados na data de nascimento se disponível
      if (birthDate) {
        const [year, month, day] = birthDate.split('-');
        const birthYear = year;
        const birthMonth = month;
        const birthDay = day;
        
        // Adiciona padrões com a data de nascimento
        patterns.push(
          `${nameLower}${birthYear}`,
          `${nameLower}${birthDay}${birthMonth}`,
          `${nameLower}${birthMonth}${birthDay}`,
          `${birthDay}${birthMonth}${birthYear}`,
          `${birthMonth}${birthDay}${birthYear}`,
          `${nameLower}${birthDay}${birthMonth}${birthYear}`,
          `${emailUser}${birthYear}`,
          `${emailUser}${birthDay}${birthMonth}`,
          `${emailUser}${birthMonth}${birthDay}`,
          `${birthYear}${nameLower}`,
          `${birthDay}${birthMonth}${nameLower}`,
          `${birthMonth}${birthDay}${nameLower}`
        );
      }

      // Add variations with special characters
      const specialChars = ['!', '@', '#', '$', '%', '&', '*'];
      patterns.forEach(pattern => {
        specialChars.forEach(char => {
          patterns.push(`${pattern}${char}`);
          patterns.push(`${char}${pattern}`);
        });
      });

      // Filter out duplicates and invalid lengths
      this.commonPatterns = Array.from(new Set(patterns));
    }
  }

  next(): string | null {
    if (this.commonPatterns.length > 0) {
      return this.commonPatterns.shift() || this.generateNext();
    }
    return this.generateNext();
  }

  private generateNext(): string | null {
    for (let i = this.length - 1; i >= 0; i--) {
      const currentIndex = this.charset.indexOf(this.currentPassword[i]);
      if (currentIndex < this.charset.length - 1) {
        this.currentPassword[i] = this.charset[currentIndex + 1];
        return this.currentPassword.join('');
      }
      this.currentPassword[i] = this.charset[0];
    }
    return null;
  }

  *generate(): Generator<string> {
    // First yield all common patterns
    for (const pattern of this.commonPatterns) {
      yield pattern;
    }
    this.commonPatterns = []; // Clear patterns after using them

    // Then continue with brute force generation
    let result = this.currentPassword.join('');
    yield result;

    while ((result = this.generateNext()!) !== null) {
      yield result;
    }
  }
}