'use client';

import { useState, useEffect } from 'react';
import { PasswordBruteForce } from '@/lib/password-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Play, Pause, RotateCcw, User, Mail, Calendar } from 'lucide-react';
import { CheckedState } from '@radix-ui/react-checkbox';

export default function Home() {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [length, setLength] = useState(8);
  const [useUppercase, setUseUppercase] = useState<CheckedState>(true);
  const [useLowercase, setUseLowercase] = useState<CheckedState>(true);
  const [useNumbers, setUseNumbers] = useState<CheckedState>(true);
  const [useSpecial, setUseSpecial] = useState<CheckedState>(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');

  useEffect(() => {
    let generator: Generator<string>;
    let intervalId: NodeJS.Timeout;

    if (isGenerating) {
      generator = new PasswordBruteForce(
        useUppercase === true,
        useLowercase === true,
        useNumbers === true,
        useSpecial === true,
        length,
        { name, email, birthDate }
      ).generate();

      intervalId = setInterval(() => {
        const batch: string[] = [];
        for (let i = 0; i < 100; i++) {
          const next = generator.next();
          if (next.done) {
            setIsGenerating(false);
            break;
          }
          batch.push(next.value);
        }
        setPasswords(prev => [...prev, ...batch]);
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isGenerating, length, useUppercase, useLowercase, useNumbers, useSpecial, name, email, birthDate]);

  const handleReset = () => {
    setPasswords([]);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Gerador de Senhas por Força Bruta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Alvo</Label>
                  <div className="relative">
                    <User className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      className="pl-8"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Digite o nome"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email do Alvo</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-8"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite o email"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="birthDate"
                      type="date"
                      className="pl-8"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="length">Tamanho Mínimo da Senha</Label>
                  <Input
                    id="length"
                    type="number"
                    min="4"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value) || 4)}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={useUppercase === true}
                      onCheckedChange={setUseUppercase}
                    />
                    <Label htmlFor="uppercase">Maiúsculas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={useLowercase === true}
                      onCheckedChange={setUseLowercase}
                    />
                    <Label htmlFor="lowercase">Minúsculas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={useNumbers === true}
                      onCheckedChange={setUseNumbers}
                    />
                    <Label htmlFor="numbers">Números</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="special"
                      checked={useSpecial === true}
                      onCheckedChange={setUseSpecial}
                    />
                    <Label htmlFor="special">Caracteres Especiais</Label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsGenerating(!isGenerating)}
                  className="flex-1"
                  disabled={!name || !email}
                >
                  {isGenerating ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" /> Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" /> Iniciar
                    </>
                  )}
                </Button>
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>Senhas Geradas ({passwords.length})</Label>
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="grid grid-cols-4 gap-2">
                  {passwords.map((password, index) => (
                    <code key={index} className="font-mono text-sm">
                      {password}
                    </code>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}