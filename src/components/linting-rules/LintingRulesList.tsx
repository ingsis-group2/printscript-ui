import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  Checkbox,
  List,
  ListItem,
  ListItemText, TextField,
  Typography
} from "@mui/material";
import {useGetLintingRules, useModifyLintingRules} from "../../utils/queries.tsx";
import {queryClient} from "../../App.tsx";
import {Rule} from "../../types/Rule.ts";

const LintingRulesList = () => {
  const [rules, setRules] = useState<Rule[] | undefined>([]);

  const {data, isLoading} = useGetLintingRules();
  const {mutateAsync, isLoading: isLoadingMutate} = useModifyLintingRules({
    onSuccess: () => queryClient.invalidateQueries('lintingRules')
  })

  useEffect(() => {
    setRules(data)
  }, [data]);

  const handleValueChange = (rule: Rule, newValue: string | number) => {
    const newRules = rules?.map(r => {
      if (r.name === rule.name) {
        return {...r, value: newValue}
      } else {
        return r;
      }
    })
    setRules(newRules)
  };

  const handleNumberChange = (rule: Rule) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    handleValueChange(rule, isNaN(value) ? 0 : value);
  };

  const toggleRule = (rule: Rule) => () => {
    const newRules = rules?.map(r => {
      if (r.name === rule.name) {
        const modifiedRule = typeof rule.value === 'boolean'
            ? {...r, isActive: !r.isActive, value: !r.value}
            : typeof rule.value === 'string'
                ? {...r, isActive: !r.isActive, value: null}
                : {...r, isActive: !r.isActive};
        return modifiedRule;
      } else {
        return r;
      }
    });
    setRules(newRules);
  };

  function formatRuleName(name: string){
    const words = name.split(/(?=[A-Z])/);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  }

  return (
    <Card style={{padding: 16, margin: 16}}>
      <Typography variant={"h6"}>Linting rules</Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
          isLoading || isLoadingMutate ?  <Typography style={{height: 80}}>Loading...</Typography> :
          rules?.map((rule) => {
          return (
            <ListItem
              key={rule.name}
              disablePadding
              style={{height: 40}}
            >
              <Checkbox
                edge="start"
                checked={rule.isActive}
                disableRipple
                onChange={toggleRule(rule)}
              />
              <ListItemText primary={formatRuleName(rule.name)} />
              {typeof rule.value === 'number' ?
                (<TextField
                  type="number"
                  variant={"standard"}
                  value={rule.value}
                  onChange={handleNumberChange(rule)}
                />) : typeof rule.value === 'string' ?
                  (<TextField
                    variant={"standard"}
                    value={rule.value}
                    onChange={e => handleValueChange(rule, e.target.value)}
                  />) : null
              }
            </ListItem>
          )
        })}
      </List>
      <Button disabled={isLoading} variant={"contained"} onClick={() => mutateAsync(rules ?? [])}>Save</Button>
    </Card>

  );
};

export default LintingRulesList;